import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faEdit,
  faFile,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "@reduxjs/toolkit";
import { debounce, isEqual } from "lodash";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import styledComponents from "styled-components";
import useAPI from "../hooks/useAPI";
import {
  fetchCategories,
  fetchMeals,
  selectAllMealsByCategory,
} from "../reducer/redux2";

export const CategoriesNavbar = memo(({ categories, onClick }) => {
  return (
    <div className="categories-navbar">
      {categories
        ?.filter((c) => c.itemIds?.length !== 0)
        .map(({ id, title }, index) => (
          <div key={id} className="category">
            <Button
              variant="transparent"
              className="category-text"
              id={id}
              onClick={() => onClick(index)}
            >
              {title}
            </Button>
          </div>
        ))}
    </div>
  );
}, isEqual);
export const EditableCategoriesNavbar = memo((props) => {
  return (
    <div>
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

    const debouncedCallback = useMemo(
      () => debounce(onChange, 500),
      [onChange]
    );

    useEffect(() => {
      debouncedCallback(index, { title, text, id, photoURL });
    }, [title, text, photoURL, index, debouncedCallback, id]);

    return (
      <StyledFormInput>
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
            rows="7"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="photo-wrapper">
          <Form.Label>photoURL</Form.Label>
          <OverlayTrigger
            trigger={["hover", "focus"]}
            overlay={
              <Tooltip>
                <a
                  className="px-3 text-light-primary"
                  href={photoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {photoURL}
                </a>
              </Tooltip>
            }
          >
            <Button
              variant={photoURL ? "primary" : "light-primary"}
              size="sm"
              className="m-2"
            >
              <FontAwesomeIcon icon={faFile} />
            </Button>
          </OverlayTrigger>
        </div>
        <Form.Control type="file" />
      </StyledFormInput>
    );
  },
  isEqual
);

const EditModal = memo(({ categories: initialCategories }) => {
  const [show, setShow] = useState(false);
  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);
  const { updateCategoriesAndMeals } = useAPI();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState(initialCategories);
  const [changedCategories, setChangedCategories] = useState(initialCategories);
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState(0);

  const handleSave = useCallback(() => {
    updateCategoriesAndMeals(changedCategories).then(() => {
      setEditMode(false);
      setActive(0);
      dispatch(fetchMeals()).then(({ payload }) =>
        dispatch(fetchCategories(payload))
      );
    });
  }, [dispatch, updateCategoriesAndMeals, changedCategories]);

  const handleCancel = useCallback(() => {
    setChangedCategories(initialCategories);
    setCategories(initialCategories);
    setActive(0);
    setEditMode(false);
  }, [initialCategories]);
  const handleAdd = useCallback(() => {
    setChangedCategories((old) => {
      const newCategories = [
        ...old,
        {
          title: "New Category",
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
  useEffect(() => {
    setCategories(initialCategories);
    setChangedCategories(initialCategories);
  }, [initialCategories]);
  const saveDisabled = isEqual(changedCategories, initialCategories);
  return (
    <>
      <div className="edit-btn-wrapper">
        <Button onClick={handleShow}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <StyledEditableNavbar>
          <Modal.Header closeButton={false}>Edit Categories</Modal.Header>
          <Modal.Body className="bg-white">
            <div className="wrapper">
              <div className="left-side">
                {categories?.map(({ title, id, itemIds, ...rest }, index) => (
                  <div className="btn-wrapper" key={id}>
                    {index === active ? (
                      <div className="group">
                        <Button
                          variant="light-primary"
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
                          variant="light-primary"
                          disabled={index === categories.length - 1}
                          onClick={() => handleMove(index, index + 1)}
                        >
                          <FontAwesomeIcon icon={faChevronDown} />
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => handleActiveChange(index)}>
                        {title}
                      </Button>
                    )}
                  </div>
                ))}
                <div className="add-btn">
                  <Button onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              </div>
              <div className="flex-fill">
                {categories?.map(({ title, id, itemIds, ...rest }, index) => (
                  <div key={id} className="category">
                    {active === index && (
                      <FormInput
                        title={title}
                        id={id}
                        {...rest}
                        index={index}
                        onChange={handleTitleChange}
                      ></FormInput>
                    )}
                  </div>
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

const StyledEditableNavbar = styledComponents.div`
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
    .left-side{
      width: 200px;
      padding: 0 1rem;
      .btn-primary{ 
        text-shadow: 1px 1px 3px rgb(34 34 34 / 70%);
      }
      .group{
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        button{

          border: solid 4px transparent !important;
          &:hover{
            background-color: var(--bs-light-primary) !important;
            border-color: var(--bs-light-primary) !important
          }
          box-shadow: none;
          margin: 0;
          svg{
            transform: scale(0.75);
          }
          &:first-child{
            height: 20px;
            width: 20px;
            padding: 0;
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
        margin: 0.5rem 0;
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
    .category-text{
      height: 44px;
      border-radius: 1rem;
    }
    .add-btn{
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
    `;
const StyledFormInput = styledComponents.div`
      font-size: 0.875rem;
      display: flex;
      flex-direction: column;
      background-color: var(--bs-light-primary);
      padding: 0 1.25rem 1.25rem 1.25rem;
      border-radius: 1rem;
      label{
        font-weight: 700;
        margin: 0.75rem 0.5rem 0.5rem;
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
        justify-content: start;
        flex-wrap: nowrap;

      }
`;
