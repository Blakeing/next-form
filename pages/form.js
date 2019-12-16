import React, { useState } from 'react';
import {
  Formik,
  Form,
  useField,
  Field,
  ErrorMessage,
  FieldArray
} from 'formik';
import * as Yup from 'yup';
import { Debug } from '../components/debug';
import { generate } from 'shortid';

const MySelect = ({ ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <select className="form-control" {...field} {...props} />
    </>
  );
};

const MyTextArea = ({ ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <textarea className="form-control" {...field} {...props} />
    </>
  );
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address format'),

  password: Yup.string().min(3, 'Password must be 3 characters at minimum')
});

const SignupForm = () => {
  const [status, setStatus] = useState({
    info: { error: false, msg: null }
  });
  const handleResponse = (status, msg) => {
    if (status === 200) {
      setStatus({
        info: { error: false, msg: msg }
      });
    } else {
      setStatus({
        info: { error: true, msg: msg }
      });
    }
  };
  return (
    <div className="container">
      <div className="row mb-5">
        <div className="col-lg-12 text-center">
          <h1 className="mt-5">Login Form</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <Formik
            initialValues={{
              email: '',
              password: '',
              jobType: '',
              comments: '',
              cookies: [],
              terms: '',
              newsletter: '',
              firstName: '',
              pets: [{ type: '', name: '', id: '1' }]
            }}
            validationSchema={LoginSchema}
            onSubmit={async data => {
              await sleep(1000);
              setStatus(prevStatus => ({ ...prevStatus }));
              const res = await fetch('/api/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
              const text = await res.text();
              handleResponse(res.status, text);
            }}
          >
            {({ touched, errors, values, isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Field
                    name="firstName"
                    placeholder="First Name"
                    className={`form-control ${
                      touched.firstName && errors.firstName ? 'is-invalid' : ''
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="firstName"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`form-control ${
                      touched.email && errors.email ? 'is-invalid' : ''
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className={`form-control ${
                      touched.password && errors.password ? 'is-invalid' : ''
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="jobType">Job Type</label>
                  <MySelect
                    className={`form-control ${
                      touched.jobType && errors.jobType ? 'is-invalid' : ''
                    }`}
                    name="jobType"
                  >
                    <option value="">Select Job Type</option>
                    <option value="designer">Designer</option>
                    <option value="programmer">Programmer</option>
                  </MySelect>
                  <ErrorMessage
                    component="div"
                    name="jobType"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="comments">Comments</label>
                  <MyTextArea
                    className={`form-control ${
                      touched.comments && errors.comments ? 'is-invalid' : ''
                    }`}
                    id="comments"
                    rows="3"
                    name="comments"
                  />
                  <ErrorMessage
                    component="div"
                    name="comments"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="comments">
                    What kind of cookies do you like?
                  </label>
                  <div className="form-check">
                    <Field
                      className="form-check-input"
                      type="checkbox"
                      value="sugar"
                      name="cookies"
                      id="sugar"
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Sugar
                    </label>
                  </div>
                  <div className="form-check">
                    <Field
                      className="form-check-input"
                      type="checkbox"
                      value="chocolate"
                      name="cookies"
                      id="chocolate"
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Chocolate
                    </label>
                  </div>
                </div>
                <hr />
                <label htmlFor="comments">
                  Would you like to add a team member?
                </label>
                <FieldArray
                  name="pets"
                  render={arrayHelpers => (
                    <div>
                      {values.pets && values.pets.length > 0 ? (
                        values.pets.map((pets, index) => (
                          <div key={index}>
                            <div className="form-group">
                              <Field
                                placeholder="Pet's name"
                                name={`pets.${index}.name`}
                                className={`form-control ${
                                  touched.firstName && errors.firstName
                                    ? 'is-invalid'
                                    : ''
                                }`}
                              />
                              <ErrorMessage
                                component="div"
                                name={`pets.${index}.name`}
                                className="invalid-feedback"
                              />
                            </div>
                            <div className="form-group">
                              <MySelect
                                name={`pets.${index}.type`}
                                type="select"
                              >
                                <option value="">Select a pet</option>
                                <option value="cat">cat</option>
                                <option value="dog">dog</option>
                                <option value="frog">frog</option>
                              </MySelect>
                            </div>
                            <div className="form-group">
                              <button
                                className="btn btn-primary mr-2 "
                                type="button"
                                onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                              >
                                -
                              </button>
                              <button
                                className="btn btn-primary  "
                                type="button"
                                onClick={() =>
                                  arrayHelpers.push({
                                    type: '',
                                    name: '',
                                    id: generate()
                                  })
                                } // insert an empty string at a position
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <button
                          className="btn btn-primary "
                          type="button"
                          onClick={() =>
                            arrayHelpers.push({
                              type: '',
                              name: '',
                              id: generate()
                            })
                          }
                        >
                          {/* show this when user has removed all friends from the list */}
                          Add a team member
                        </button>
                      )}
                    </div>
                  )}
                />
                <div className="form-group">
                  <div className="form-check">
                    <Field
                      className="form-check-input"
                      type="checkbox"
                      name="terms"
                    />
                    <label className="form-check-label" htmlFor="">
                      I accept the terms and conditions.
                    </label>
                  </div>
                  {!!values.terms ? (
                    <>
                      <div className="form-check">
                        <Field
                          className="form-check-input"
                          type="checkbox"
                          name="newsletter"
                        />
                        <label className="form-check-label">
                          Send me the newsletter
                        </label>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="btn btn-primary mt-4"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Please wait...' : 'Submit'}
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
                {status.info.error && (
                  <div className="alert alert-danger" role="alert">
                    Error: {status.info.msg}
                  </div>
                )}
                {!status.info.error && status.info.msg && (
                  <div className="alert alert-success" role="alert">
                    {status.info.msg}
                  </div>
                )}
                <Debug />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default SignupForm;
