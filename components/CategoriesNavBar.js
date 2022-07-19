import {
  faChevronDown,
  faChevronUp,
  faEdit,
  faImage,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "@reduxjs/toolkit";
import { debounce, isEqual } from "lodash";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import styledComponents from "styled-components";
import useAPI from "../hooks/useAPI";
import { postPhoto } from "../utilities/utils.mjs";

export const CategoriesNavbar = memo(({ categories, onClick }) => {
  return (
    <div className="categories-navbar">
      <div className="categories-list">
        {categories
          ?.filter((c) => c.itemIds?.length !== 0)
          .map(({ id, title }, index) => (
            <div key={id} className="category" id={"category-" + id}>
              <Button
                variant="transparent"
                className="category-text"
                id={"category-btn-" + id}
                onClick={() => onClick(index)}
              >
                {title}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}, isEqual);
export const EditableCategoriesNavbar = memo((props) => {
  return (
    <div className="editable-categories-navbar">
      <EditModal {...props}></EditModal>
      <CategoriesNavbar {...props} />
    </div>
  );
}, isEqual);

const FormInput = memo(
  ({
    title: initialTitle,
    index,
    onChange,
    text: initialText,
    id,
    photoURL: initialPhotoURL,
  }) => {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialText);
    const [photoURL, setPhotoURL] = useState(initialPhotoURL);
    const [photoFile, setPhotoFile] = useState();

    const debouncedCallback = useMemo(
      () => debounce(onChange, 500),
      [onChange]
    );
    const handleFileChange = useCallback((e) => {
      const [file] = e.target.files;
      const url = URL.createObjectURL(file);
      setPhotoURL(url);
      setPhotoFile(file);
    }, []);
    useEffect(() => {
      debouncedCallback(index, { title, text, id, photoURL, photoFile });
    }, [title, text, photoURL, index, debouncedCallback, id, photoFile]);

    return (
      <StyledFormInput className="form-input">
        <ImageComponent photoURL={photoURL} onChange={handleFileChange} />
        <div>
          <Form.Label>Title</Form.Label>
          <Form.Control
            className="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </StyledFormInput>
    );
  },
  isEqual
);

const EditModal = memo(({ categories: initialCategories }) => {
  const [show, setShow] = useState(false);
  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);
  const { updateCategoriesAndMeals, fetchMeals, fetchCategories, dispatch } =
    useAPI();

  const [categories, setCategories] = useState(initialCategories);
  const [changedCategories, setChangedCategories] = useState(initialCategories);
  const [active, setActive] = useState(0);

  const handleSave = useCallback(async () => {
    const promises = changedCategories.map(({ photoFile, photoURL }) =>
      photoFile
        ? postPhoto(photoFile, "categories").then((r) => r.json())
        : { url: photoURL }
    );
    await Promise.all(promises).then((arr) => {
      const newCategories = changedCategories.map(
        ({ photoFile, ...rest }, index) => ({
          ...rest,
          photoURL: arr[index].url,
        })
      );
      updateCategoriesAndMeals(newCategories).then(() => {
        handleClose();
        setActive(0);
        fetchMeals().then(({ payload }) => fetchCategories(payload));
      });
    });
  }, [
    fetchMeals,
    updateCategoriesAndMeals,
    changedCategories,
    handleClose,
    fetchCategories,
  ]);

  const handleCancel = useCallback(() => {
    setChangedCategories(initialCategories);
    setCategories(initialCategories);
    setActive(0);
    handleClose();
  }, [initialCategories, handleClose]);
  const handleAdd = useCallback(() => {
    setChangedCategories((old) => {
      const id =
        old.filter((c) => c.title.slice(0, -1) === "New Category").length + 1;
      const newCategories = [
        ...old,
        {
          title: "New Category" + id,
          text: "",
          photoURL: "",
          itemIds: [],
          id: nanoid(),
        },
      ];
      setCategories(newCategories);
      setActive(newCategories.length - 1);
      return newCategories;
    });
  }, []);
  const handleMove = useCallback(
    (f, t) =>
      setCategories((old) => {
        const from = changedCategories[f];
        const to = changedCategories[t];
        const newCategories = [...changedCategories];
        newCategories[f] = to;
        newCategories[t] = from;
        setChangedCategories(newCategories);
        setActive(t);

        return newCategories;
      }),

    [changedCategories]
  );
  const handleTitleChange = useCallback(
    (index, values) =>
      setChangedCategories((old) => {
        const newCategories = [...old];
        newCategories[index] = {
          ...newCategories[index],
          ...values,
        };
        return newCategories;
      }),
    []
  );
  const handleActiveChange = useCallback(
    (index) => {
      setActive(index);
      setCategories(changedCategories);
    },
    [changedCategories]
  );
  const handleRemove = useCallback(
    (id) => {
      setChangedCategories((old) => {
        const newCategories = old.filter((c) => c.id !== id);
        setCategories(newCategories);
        return newCategories;
      });
      handleActiveChange(0);
    },
    [handleActiveChange]
  );
  useEffect(() => {
    setCategories(initialCategories);
    setChangedCategories(initialCategories);
  }, [initialCategories]);
  const saveDisabled = isEqual(changedCategories, initialCategories);
  return (
    <>
      <div className="edit-btn-wrapper w-100 d-flex justify-content-center align-items-center my-2">
        <Button
          style={{ height: "35px", width: "35px", padding: 0 }}
          onClick={handleShow}
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="w-100"
        className="item-modal"
      >
        <StyledEditableNavbar>
          <Modal.Header closeButton>Edit Categories</Modal.Header>
          <Modal.Body className="bg-white">
            <div className="wrapper">
              <div className="left-side">
                <div className="categories-btn">
                  {categories?.map(({ title, id, itemIds, ...rest }, index) => (
                    <div className="btn-wrapper" key={id}>
                      {index === active ? (
                        <div className="active-wrapper">
                          <div className="group">
                            <Button
                              variant="light-primary"
                              className="move-btn"
                              disabled={index === 0}
                              onClick={() => handleMove(index, index - 1)}
                            >
                              <FontAwesomeIcon icon={faChevronUp} />
                            </Button>
                            <Button
                              variant="light-primary"
                              onClick={() => handleActiveChange(index)}
                            >
                              {title}
                            </Button>
                            <Button
                              className="move-btn"
                              variant="light-primary"
                              disabled={index === categories.length - 1}
                              onClick={() => handleMove(index, index + 1)}
                            >
                              <FontAwesomeIcon icon={faChevronDown} />
                            </Button>
                          </div>
                          {/* <Button className="remove-btn" variant="light-primary">
                          <FontAwesomeIcon icon={faMinus} />
                        </Button> */}
                          <RemoveBtn
                            onClick={() => handleRemove(id)}
                            tooltip={itemIds?.length !== 0}
                          />
                        </div>
                      ) : (
                        <Button onClick={() => handleActiveChange(index)}>
                          {title}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="add-btn">
                  <Button onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              </div>
              <div className="active-category">
                {categories
                  .map((c, index) => ({ ...c, index }))
                  ?.filter((c, index) => index === active)
                  .map(({ title, id, itemIds, ...rest }) => (
                    <FormInput
                      key={id}
                      title={title}
                      id={id}
                      {...rest}
                      onChange={handleTitleChange}
                    ></FormInput>
                  ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-around">
            <>
              <div className="footer-wrapper">
                <div className="btn-wrapper">
                  <Button disabled={saveDisabled} onClick={handleSave}>
                    Save
                  </Button>
                </div>
                <div className="btn-wrapper">
                  <Button onClick={handleCancel}>Cancel</Button>
                </div>
              </div>
            </>
          </Modal.Footer>
        </StyledEditableNavbar>
      </Modal>
    </>
  );
}, isEqual);

const RemoveBtn = memo(({ onClick, tooltip }) => {
  return (
    <>
      {tooltip ? (
        <OverlayTrigger
          trigger={["hover", "focus"]}
          overlay={
            <Tooltip>
              <div>
                There are still items in this category. Please move them to
                another in order to delete this.
              </div>
            </Tooltip>
          }
        >
          <Button className="remove-btn" variant="light-primary">
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </OverlayTrigger>
      ) : (
        <Button
          className="remove-btn"
          variant="light-primary"
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faMinus} />
        </Button>
      )}
    </>
  );
}, isEqual);

const ImageComponent = memo(({ photoURL, onChange }) => {
  return (
    <ImageWrapper onChange={onChange} photoURL={photoURL}>
      <label className={`file-label`} htmlFor="formId">
        <input name="" type="file" id="formId" hidden />
        {photoURL && (
          <Image alt="alt" src={photoURL} layout="fill" objectFit="cover" />
        )}
        <div className="backdrop">
          <FontAwesomeIcon icon={faImage} />
        </div>
      </label>
    </ImageWrapper>
  );
}, isEqual);

const ImageWrapper = styledComponents.div`
${(props) =>
  !props.photoURL &&
  `
      
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 15%), 0 1px 1px rgb(46 54 80 / 8%);
    .backdrop{
      opacity: 1 !important;
      background-color: var(--bs-primary) !important;
      color: var(--bs-light-primary) !important;
    }
  `}
display: flex;
align-items: center;
justify-content: center;
label{
  padding: 0 !important;
}
overflow: hidden;
margin-top: 1.25rem;
background-color: white;
border-radius: 0.5rem;
width: 100%;
box-shadow: 0 0 0 0.5px #0000005c;
aspect-ratio: 3;
maxWidth: 100%;
position: relative;
cursor: pointer;
&:hover .backdrop{
  opacity: 1; 
}
.backdrop{
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bs-light-primary);
  svg{
    width: 50%;
    height: 50%;
  }
  transition: all 0.5s linear;
  opacity: 0; 
    background-color: rgba(212,8,17,0.2);
  width: 100%;
  height: 100%;
  z-index: 5;
  position: absolute;
  top: 0;
}
label{
  width: 100%;
  height: 100%;
  cursor: pointer;
}

`;

const StyledEditableNavbar = styledComponents.div`
display: flex;
flex-direction: column;
height: 100%;
width: 100%;
.active-category{
  flex: 1 1 auto;
}
  .btn-light-primary{
            &:hover{
            color: white;
            text-shadow: 1px 1px 3px rgb(34 34 34 / 70%);
            transition: background-color 0.1s linear;
            background-color: var(--bs-primary) !important;
            border-color: var(--bs-primary) !important
          }
    }
  .active-wrapper{
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;

      .remove-btn, .move-btn{
        padding: 0;
        height: 20px;
        width: 20px;
        min-width: 20px;
        min-height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .modal-footer{
      border-top: 1px solid #eaeaea;
    }
    .modal-header{
      box-shadow: none;
      padding: 1rem 1.5rem 1rem 1.5rem;
      font-weight: 700;
      background-color: var(--bs-primary);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      text-shadow: 1px 1px 3px rgb(34 34 34 / 70%);
      border-bottom: 1px solid #eaeaea;
    }
    .wrapper{
      display: flex;
      flex-wrap: nowrap;
    }
    .categories-btn{
      max-height: 60vh;
      overflow: auto;
      padding-right: 1rem;
    }
    .left-side{
      max-width: 150px;
      min-width: 150px;
                svg{
            transform: scale(0.75);
          }
      .btn-primary{ 
        text-shadow: 1px 1px 3px rgb(34 34 34 / 70%);
      }
      .group{
        padding-right: 10px;
        width: 100%;
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        button{

          border: solid 1px transparent !important;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;

          &:first-child{
            height: 20px;
            width: 20px;
            padding: 0;
            margin: 0;
            margin-bottom: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &:nth-child(2){
          }
          &:nth-child(3){
            height: 20px;
            width: 20px;
            padding: 0;
            margin-top: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      button{
        width: 100%;
        border-radius: 1rem;
        height: fit-content;
      }
      
    }
    .categories-navbar{
      height: fit-content;
      max-height: initial;
      position: initial;
    }
    .category{
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      position: relative;
      padding: 0;
    }
    .move-btn{
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      button{
        padding: 0;
        height: 30px;
        width: 30px;
        border-radius: 1rem;
        margin: 0.5rem 0;
        text-align: center;
      }
    }
    .btn-wrapper{
      margin: 0.5rem 0;
    }
    .category-text{
      height: 44px;
      border-radius: 1rem;
    }
    .add-btn{
      svg{
        transform: scale(1);
      }
      weight: 100%;
      display: flex;
      justify-content: center;
      padding-top: 0.75rem;
      button{
        height: 34px;
        width: 34px;
        border-radius: 1rem;
        padding: 0;
      }
    }
    .footer-wrapper{
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      button{
        height: 44px;
        border-radius: 1rem;
        padding: 0;  
        text-shadow: 1px 1px 3px rgb(34 34 34 / 70%);
        width: 100%;
      }
      .btn-wrapper{
        width: 100%;
        display: flex;
        justify-content: center;
        padding-top: 0.5rem;
        margin: 0 0.5rem;
      }
    }
  @media (max-width: 461px) {
    .form-input{
      border-radius: 0;
      height: 100%;
    }
    .category{
      height: 100%;
    }
    .wrapper{
      flex-direction: column;
      height: 100%;
    }
    .left-side{
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      padding: 0.75rem 0;
      // display: flex;
      // flex-wrap: nowrap;
      // align-items: center;
    }
    .modal-body{
      padding:0;
    }
    .categories-btn{
      order: 2;
      height: fit-content;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      // width: fit-content;
      overflow: auto;
      .btn-wrapper{
        width: fit-content;
        padding: 0.25rem;
      }
    }
    .btn-wrapper{
      margin: 0;
      button{
        flex-wrap: nowrap !important;
        word-wrap: normal !important;
        white-space: nowrap !important;
      }
    }
    .categories-btn{
      padding-bottom: 0.5rem;
    }
    .add-btn{
      padding: 0;
      order: 1;
      padding: 0 0.5rem 0.25rem 0;

    }
    .active-wrapper {
      .remove-btn{
        display: none;
      }
    }
    .move-btn{
      margin: 0 0.25rem !important;
      transform: rotate(-90deg);
    }
    .group{
      margin: 0 !important;
      padding: 0 !important;
      flex-direction: row !important;
    }

    }
    `;
const StyledFormInput = styledComponents.div`
      width: 100%;
      font-size: 0.875rem;
      display: flex;
      flex-direction: column;
      background-color: var(--bs-light-primary);
      padding: 0 1.25rem 1.25rem 1.25rem;
      border-radius: 1rem;
      label{
        font-weight: 700;
        padding: 0.75rem 0.5rem 0.5rem;
        margin: 0;
      }
      .title{
        height: 44px;
        border-radius: 1rem;
      }
      textarea{
        resize: none;
        border-radius: 1rem;
        font-size: 0.875rem;
      }
      .photo-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        .form-label{
          width: 100%;
        }
        .file-label{
          margin: 0;
          cursor: pointer;
          // &:hover{
          //     background-color: #ed0913 !important;
          //     border-color: #ed0913 !important;
          // }
          width: fit-content;
          padding: 0.85rem;
          border-radius: 1rem;
          height: 50px;
          width: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          svg{
            height: 100%;
            width: 100%;
          }
          
        }

      }
`;
