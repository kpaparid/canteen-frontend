import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useForm, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { Fragment, useEffect } from "react";
export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  console.log(watch("extras"));

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
      <div className="m-auto">
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
                {...register("description", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                {...register("price", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control {...register("category", { required: true })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control type="file" {...register("photo")} />
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
                      <option value="Selection">Selection</option>
                      <option value="Multi Checkbox">Multi Checkbox</option>
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
