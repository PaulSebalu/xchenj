import React, { useEffect, useState } from "react";
import { Form, Row, Col, Spinner, Button } from "react-bootstrap";
import Select from "react-select";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import Humanize from "humanize-plus";

import equalsSign from "../../img/equals-solid.svg";
import SwitchIcon from "./switchIcon";

import { axiosInstance } from "../../core/utils";
import { Placeholder, reactSelectStyles, formatGroupLabel } from "./utils";

import "./scss/index.scss";

const ExchangeForm = () => {
  const [values, setValues] = useState({
    amount: 1,
    conversion: 0,
    baseCurrency: {},
    exchangeCurrency: {},
    cryptos: [],
    fiats: [],
    currencyOptionsSpinnerStatus: false,
    conversionSpinnerStatus: false,
  });

  const [errors, setErrors] = useState({});

  const fiatOptions = values.fiats.map(fiatCurrency => ({
    ...fiatCurrency,
    label: `${
      fiatCurrency.name
    } ${`"${fiatCurrency.sign}"`}  ${`(${fiatCurrency.symbol})`}`,
    value: fiatCurrency.symbol,
  }));

  const cryptoOptions = values.cryptos.map(cryptoCurrency => ({
    ...cryptoCurrency,
    label: `${cryptoCurrency.name} ${`(${cryptoCurrency.symbol})`}`,
    value: cryptoCurrency.symbol,
  }));

  const groupedOptions = [
    {
      label: "Fiat currencies",
      options: fiatOptions,
    },
    {
      label: "Cryptocurrencies",
      options: cryptoOptions,
    },
  ];

  const onChange = (event, action) => {
    event && action
      ? setValues(values => ({
          ...values,
          [action.name]: event,
        }))
      : setValues(values => ({
          ...values,
          [event.target.name]: event.target.value,
        }));
  };

  const onAmountChange = values => {
    const { value } = values;
    setValues(values => ({
      ...values,
      ["amount"]: value,
    }));
  };

  const handleSwitch = event => {
    event.preventDefault();

    const baseCurrency = values.baseCurrency;
    const exchangeCurrency = values.exchangeCurrency;

    setValues(values => ({
      ...values,
      ["baseCurrency"]: exchangeCurrency,
    }));

    setValues(values => ({
      ...values,
      ["exchangeCurrency"]: baseCurrency,
    }));
  };

  useEffect(() => {
    if (
      Object.keys(values.baseCurrency || {}).length === 0 &&
      Object.keys(values.exchangeCurrency || {}).length === 0
    )
      setValues(values => ({
        ...values,
        ["conversionSpinnerStatus"]: true,
      }));

    if (values.conversion > 0)
      setValues(values => ({
        ...values,
        ["conversionSpinnerStatus"]: false,
      }));
  }, [values.baseCurrency, values.conversion, values.exchangeCurrency]);

  useEffect(() => {
    const fetchCurrencyConversion = async (
      amount = values.amount,
      baseCurrency = values.baseCurrency.id,
      exchangeCurrency = values.exchangeCurrency.symbol
    ) => {
      try {
        setValues(values => ({
          ...values,
          ["conversionSpinnerStatus"]: true,
        }));

        const {
          data: { quote },
        } = await axiosInstance.post(`/convert`, {
          amount,
          baseCurrency,
          exchangeCurrency,
        });

        const { price } = quote[`${exchangeCurrency}`];

        if (price) setValues(values => ({ ...values, conversion: price }));
      } catch (error) {
        // FIXME: Make error handling more explicit
        setErrors(errors => ({
          ...errors,
          ["apiError"]: "Something went wrong!",
        }));
      }
    };
    if (values.baseCurrency.id && values.exchangeCurrency.symbol)
      fetchCurrencyConversion();
  }, [values.baseCurrency, values.exchangeCurrency, values.amount]);

  useEffect(() => {
    const fetchCurrencies = async currency => {
      try {
        const { data } = await axiosInstance.get(
          `/listing?currency=${currency}`
        );

        if (data) setValues(values => ({ ...values, [currency]: data }));
      } catch (error) {
        // FIXME: Make error handling more explicit
        setErrors(errors => ({
          ...errors,
          ["apiError"]: "Something went wrong!",
        }));
      }
    };

    fetchCurrencies("cryptos");

    fetchCurrencies("fiats");
  }, []);

  useEffect(() => {
    if (values.fiats.length === 0 && values.cryptos.length === 0) {
      setValues(values => ({
        ...values,
        ["currencyOptionsSpinnerStatus"]: true,
      }));
    }

    if (values.fiats.length > 0 && values.cryptos.length > 0) {
      setValues(values => ({
        ...values,
        ["baseCurrency"]: cryptoOptions[0],
      }));

      setValues(values => ({
        ...values,
        ["exchangeCurrency"]: fiatOptions[0],
      }));

      setValues(values => ({
        ...values,
        ["currencyOptionsSpinnerStatus"]: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.fiats, values.cryptos]);

  return (
    <div className="container-fluid exchange-canvas">
      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-8">
          <div className="exchange-canvas__form mt-5 p-4">
            <Form noValidate>
              <Row>
                <Col sm={12} md={5}>
                  <Form.Group className="my-3">
                    <NumberFormat
                      className="form-control"
                      name="amount"
                      thousandSeparator={true}
                      value={values.amount}
                      onValueChange={onAmountChange}
                      placeholder="Amount to convert"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.amount || ""}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              {values.currencyOptionsSpinnerStatus === true ? (
                <Col sm={2}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Col>
              ) : (
                <>
                  <Row className="justify-content-start">
                    <Col sm={12} md={5}>
                      <Form.Group>
                        <Select
                          name="baseCurrency"
                          value={values.baseCurrency}
                          onChange={onChange}
                          options={groupedOptions}
                          className="exchange-canvas--select"
                          classNamePrefix="exchange-canvas--select"
                          components={{ Placeholder }}
                          placeholder={"Choose your currency"}
                          theme={theme => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary: "#21ce99",
                            },
                          })}
                          styles={reactSelectStyles}
                          formatGroupLabel={formatGroupLabel}
                        />
                      </Form.Group>
                    </Col>
                    <Col
                      sm={12}
                      md={2}
                      className="text-center exchange-canvas__img"
                    >
                      <Button
                        onClick={handleSwitch}
                        type="submit"
                        className="btn-sm mt-md-2"
                        variant="primary"
                      >
                        <SwitchIcon className="exchange-canvas--img" />
                      </Button>
                    </Col>
                    <Col sm={12} md={5}>
                      <Form.Group className="exchange-canvas--margin-y">
                        <Select
                          name="exchangeCurrency"
                          value={values.exchangeCurrency}
                          onChange={onChange}
                          options={groupedOptions}
                          className="exchange-canvas--select"
                          classNamePrefix="exchange-canvas--select"
                          components={{ Placeholder }}
                          placeholder={"Choose exchange currency"}
                          theme={theme => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary: "#21ce99",
                            },
                          })}
                          styles={reactSelectStyles}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="justify-content-center text-center">
                    {values.conversionSpinnerStatus === true ? (
                      <>
                        <Col sm={2}>
                          <Spinner animation="border" role="status" size="sm">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col sm={12} md={5}>{`${Humanize.intComma(
                          values.amount
                        )} ${values.baseCurrency.label}`}</Col>
                        <Col sm={12} md={2} className="text-center">
                          <img
                            className="exchange-canvas--img"
                            src={equalsSign}
                            width="20"
                            loading="lazy"
                          />
                        </Col>
                        <Col sm={12} md={5}>
                          {" "}
                          <span className="fw-bold">
                            {values.conversion > 1
                              ? `${Humanize.formatNumber(values.conversion, 2)}`
                              : `${values.conversion.toPrecision(4)}`}
                          </span>{" "}
                          {`${values.exchangeCurrency.label}`}
                        </Col>
                      </>
                    )}
                  </Row>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

ExchangeForm.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.object,
};

export default ExchangeForm;
