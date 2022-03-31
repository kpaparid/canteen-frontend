import moment from "moment";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState();
  const postCategories = useCallback(
    () =>
      category?.photoURL && category?.photoURL[0]
        ? category &&
          postPhoto(category.photoURL[0]).then((r) =>
            r.json().then(({ secure_url }) =>
              fetch(process.env.BACKEND_URI + "settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  uid: "meal-category",
                  entity: {
                    ...category,
                    photoURL: secure_url,
                    id: category.title.toLowerCase(),
                  },
                }),
              })
            )
          )
        : category &&
          fetch(process.env.BACKEND_URI + "settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: "meal-category",
              entity: {
                ...category,
                photoURL: secure_url,
                id: category.title.toLowerCase(),
              },
            }),
          }),
    [category]
  );
  const postPhoto = useCallback((file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "aewhjhan");
    formData.append("public_id", "canteen/" + moment().toISOString());
    const options = { method: "POST", body: formData };
    return fetch("https://api.cloudinary.com/v1_1/duvwxquad/upload", options);
  }, []);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      category: data.category.toLowerCase(),
      extras:
        data.extras &&
        Object.values(data.extras).map((e) => ({
          ...e,
          options: e.options && Object.values(e.options),
        })),
    };
    const file = data.photoURL[0];
    if (file?.type === "image/jpeg" || file?.type === "image/png") {
      postPhoto(file)
        .then((res) =>
          res.json().then(({ secure_url, ...rest }) => {
            const newUrl = secure_url.replace(
              "/upload/",
              "/upload/w_450,h_350,ar_1:1,c_lfill,g_center/"
            );
            return fetch(process.env.BACKEND_URI + "meals", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...formattedData, photoURL: newUrl }),
            });
          })
        )
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      await fetch(process.env.BACKEND_URI + "meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formattedData, photoURL: "" }),
      })
        .then((r) =>
          r.json().then((re) => {
            console.log("added item");
            setLoading(false);
          })
        )
        .catch(() => setLoading(false));
    }
  }, []);

  function handleExtrasChange(v, field, index) {
    setValue("extras", {
      ...(watch("extras") || {}),
      ["extra" + index]: {
        ...(watch("extras")?.["extra" + index] || {}),
        [field]: v,
      },
    });
  }
  useEffect(() => {
    register("extras", {});
  }, [register]);
  return (
    <div className="d-flex h-100 w-100">
      <Modal
        show={loading}
        dialogClassName="d-flex h-100"
        contentClassName="bg-transparent"
      >
        <Spinner
          variant="senary"
          className="m-auto"
          animation="border"
        ></Spinner>
      </Modal>
      <div className="m-auto">
        <div className="mb-3 rounded bg-senary p-4 d-flex flex-column col-5">
          <Form.Label className="text-center border-2">Add Category</Form.Label>
          <Form.Control
            onChange={(e) =>
              setCategory((old) => ({ ...old, title: e.target.value }))
            }
            placeholder="category title"
          />
          <Form.Control
            onChange={(e) =>
              setCategory((old) => ({ ...old, text: e.target.value }))
            }
            placeholder="category text"
          />
          <Form.Control
            onChange={(e) =>
              setCategory((old) => ({ ...old, photoURL: e.target.files }))
            }
            type="file"
            placeholder="category photo"
          />
          <Button onClick={postCategories}>+</Button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-wrap justify-content-around text-nonary"
        >
          <div className="mb-3 rounded bg-senary p-4 d-flex flex-column col-5">
            <Form.Label className="text-center border-bottom border-nonary border-2">
              Basic
            </Form.Label>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control {...register("name", { required: true })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ resize: "none" }}
                {...register("description")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.05"
                min="0"
                {...register("price", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control {...register("category")} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Catalogue Number</Form.Label>
              <Form.Control type="number" {...register("uid")} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control type="file" {...register("photoURL")} />
            </Form.Group>
          </div>
          <div className="mb-3 rounded bg-senary p-4 d-flex flex-column col-5">
            <Form.Label className="text-center border-bottom border-nonary border-2">
              Extras
            </Form.Label>
            {(
              (watch("extras") && Object.keys(watch("extras"))) || ["empty"]
            ).map((v, index) => {
              const type = watch("extras")?.["extra" + index]?.type;
              const options = watch("extras")?.["extra" + index]?.options;
              return (
                <Fragment key={index}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        handleExtrasChange(e.target.value, "title", index)
                      }
                    />
                    <Form.Label className="mt-2">Type</Form.Label>
                    <Form.Select
                      className="mb-4"
                      onChange={(e) =>
                        handleExtrasChange(e.target.value, "type", index)
                      }
                    >
                      <option value={null}>Select Type</option>
                      <option value="selection">Selection</option>
                      <option value="multi-checkbox">Multi Checkbox</option>
                    </Form.Select>
                    {type &&
                      type !== "Select Type" &&
                      ((options && Object.keys(options)) || ["empty"]).map(
                        (_, oIndex) => {
                          function handleOptionsChange(v, field) {
                            // const options =
                            const newOptions = {
                              ...options,
                              ["option" + oIndex]: {
                                ...options?.["option" + oIndex],
                                [field]: v,
                              },
                            };
                            handleExtrasChange(newOptions, "options", index);
                          }
                          return (
                            <Fragment key={oIndex}>
                              <div className="d-flex flex-nowrap w-100 justify-content-between">
                                <div className="col-9">
                                  <Form.Label className="mt-2">
                                    Option {oIndex + 1}
                                  </Form.Label>
                                  <Form.Control
                                    onChange={(e) =>
                                      handleOptionsChange(
                                        e.target.value,
                                        "text"
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-2">
                                  <Form.Label className="mt-2">
                                    Price
                                  </Form.Label>
                                  <Form.Control
                                    onChange={(e) =>
                                      handleOptionsChange(
                                        e.target.value,
                                        "price"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </Fragment>
                          );
                        }
                      )}
                  </Form.Group>
                  {type && options && (
                    <Button
                      variant="nonary"
                      className="w-100 h-auto mt-2"
                      onClick={() => {
                        handleExtrasChange(
                          {
                            ...options,
                            ["option" + Object.keys(options).length]: {
                              text: "",
                              price: "",
                            },
                          },
                          "options",
                          index
                        );
                      }}
                    >
                      +
                    </Button>
                  )}
                </Fragment>
              );
            })}
          </div>

          <Button type="submit" variant="nonary" className="m-auto col-12">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  return { props: {} };
}
