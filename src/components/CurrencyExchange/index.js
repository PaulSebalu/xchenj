import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Select, { components } from "react-select";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

import switchBase from "../../img/exchange-alt-solid.svg";
import { axiosInstance } from "../../core/utils";

import "./scss/index.scss";

const ExchangeForm = () => {
  const [values, setValues] = useState({
    amount: 1,
    conversion: "",
    baseCurrency: cryptocurrencyOptions[0],
    exchangeCurrency: fiatOptions[0],
  });

  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    const fetchCurrencyConversion = async () => {
      try {
        const conversion = await axiosInstance.get(
          `/v1/tools/price-conversion
          ?amount=${values.amount}&
          id=${values.baseCurrency.id}&
          convert=${values.exchangeCurrency.symbol}`
        );

        if (conversion)
          setValues(values => ({ ...values, conversion: conversion.data }));
      } catch (error) {
        // FIXME: make error handling more explicit
        setErrors(errors => ({
          ...errors,
          ["apiError"]: "Something went wrong!",
        }));
      }
    };

    fetchCurrencyConversion();
  }, [values.baseCurrency, values.exchangeCurrency, values.amount]);

  return (
    <div className="container-fluid exchange-canvas">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-10">
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
                      onChange={onChange}
                      placeholder="Amount to convert"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.amount || ""}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
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
                  md={1}
                  className="text-center exchange-canvas__img"
                >
                  <img
                    className="exchange-canvas--img"
                    src={switchBase}
                    width="40"
                    loading="lazy"
                  />
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

// React-select ************

const Placeholder = props => {
  return <components.Placeholder {...props} />;
};

const reactSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #21ce99" : "1px solid #000000",
    marginBottom: "1rem",
  }),
};

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
);

const fiatOptions = [
  {
    id: 2781,
    name: "United States Dollar",
    sign: "$",
    symbol: "USD",
  },
  {
    id: 2782,
    name: "Australian Dollar",
    sign: "$",
    symbol: "AUD",
  },
  {
    id: 2783,
    name: "Brazilian Real",
    sign: "R$",
    symbol: "BRL",
  },
].map(fiatCurrency => ({
  ...fiatCurrency,
  label: `${
    fiatCurrency.name
  } ${`"${fiatCurrency.sign}"`}  ${`(${fiatCurrency.symbol})`}`,
  value: fiatCurrency.symbol,
}));

const cryptocurrencyOptions = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
  },
  {
    id: 2,
    name: "Litecoin",
    symbol: "LTC",
  },
  {
    id: 3,
    name: "Namecoin",
    symbol: "NMC",
  },
  {
    id: 4,
    name: "Terracoin",
    symbol: "TRC",
  },
].map(cryptoCurrency => ({
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
    options: cryptocurrencyOptions,
  },
];

export default ExchangeForm;
