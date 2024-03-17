"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTime = exports.Precipitation = exports.HourlyForecastColumn = exports.NowConditionsColumn = exports.DatePanel = exports.ClockPanel = exports.WeatherPanel = void 0;
const React = require("react");
const react_1 = require("react");
const DateUtils_1 = require("./DateUtils");
const WeatherPanel = (props) => {
    const condition = props.weather.Condition;
    const forecast = props.weather.Forecast;
    return (React.createElement("div", { className: "weather-row" },
        React.createElement(exports.ClockPanel, null),
        React.createElement("div", { className: "weather-panel", style: { width: 200 } },
            React.createElement("div", { className: "title" }, "Now"),
            React.createElement("div", { className: "current-temp" }, condition.Temp),
            React.createElement("div", { className: "label" }, condition.FeelsLike),
            React.createElement("div", { className: "icon-container" },
                React.createElement("div", { className: "temp-icon", dangerouslySetInnerHTML: { __html: condition.Icon } }),
                React.createElement("div", { className: "label" }, condition.Phrase))),
        React.createElement("div", { className: "weather-panel forecast flex-row" }, forecast.slice(0, 11).map(forecast => React.createElement(ForecastPanel, { forecast: forecast })))));
};
exports.WeatherPanel = WeatherPanel;
const ClockPanel = () => {
    const [timeString, setTime] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        const timeoutId = setInterval(() => {
            const time = DateUtils_1.DateUtils.getTimeString(new Date());
            setTime(time);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, []);
    const { time, ampm } = (0, exports.splitTime)(timeString);
    return (React.createElement("div", { className: "clock" },
        React.createElement("div", null,
            React.createElement("div", { className: "clock-time" },
                time,
                React.createElement("span", { className: "ampm" }, ampm)))));
};
exports.ClockPanel = ClockPanel;
const DatePanel = () => {
    const [date, setDate] = (0, react_1.useState)("");
    const updateDate = (0, react_1.useCallback)(() => {
        const date = new Date().toLocaleDateString("en-us", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        setDate(date);
    }, [setDate]);
    (0, react_1.useEffect)(() => {
        updateDate();
        const timeoutId = setInterval(() => updateDate, 60 * 1000);
        return () => clearTimeout(timeoutId);
    }, []);
    return React.createElement("div", { className: "weather-panel" },
        React.createElement("div", { className: "clock-date" }, date));
};
exports.DatePanel = DatePanel;
const NowConditionsColumn = (props) => {
    var _a;
    const { Weather } = props;
    const { Condition } = Weather;
    const sunrise = (0, exports.splitTime)(Condition === null || Condition === void 0 ? void 0 : Condition.Sunrise);
    const sunset = (0, exports.splitTime)(Condition === null || Condition === void 0 ? void 0 : Condition.Sunset);
    return React.createElement("div", { className: "weather-column" },
        React.createElement(exports.DatePanel, null),
        React.createElement("div", { className: "weather-panel" },
            React.createElement("div", { className: "title" }, "Sunrise & sunset"),
            React.createElement("div", null,
                React.createElement("span", { className: "data" }, sunrise.time),
                React.createElement("span", { className: "ampm" }, sunrise.ampm)),
            React.createElement("div", { className: "label" }, "Sunrise"),
            React.createElement("div", null,
                React.createElement("span", { className: "data" }, sunset.time),
                React.createElement("span", { className: "ampm" }, sunset.ampm)),
            React.createElement("div", { className: "label" }, "Sunset")), (_a = Condition.Details) === null || _a === void 0 ? void 0 :
        _a.map(item => React.createElement(WeatherItem, { item: item })));
};
exports.NowConditionsColumn = NowConditionsColumn;
const HourlyForecastColumn = (props) => {
    const { Weather } = props;
    const { Hourly } = Weather;
    return React.createElement("div", { className: "weather-column" },
        React.createElement("div", { className: "weather-panel hourly" },
            React.createElement("div", { className: "title" }, "Hourly Forecast"),
            Hourly.slice(0, 21).map(hourly => React.createElement(HourlyPanel, { hourly: hourly }))));
};
exports.HourlyForecastColumn = HourlyForecastColumn;
const WeatherItem = ({ item }) => {
    const { label, dataIcon, data, labelIcon } = item;
    return React.createElement("div", { className: "weather-panel flex-row" },
        React.createElement("div", { className: "label-icon", dangerouslySetInnerHTML: { __html: labelIcon } }),
        React.createElement("div", null,
            React.createElement("span", { className: "title" }, label),
            React.createElement("div", { className: "flex-row" },
                dataIcon && React.createElement("span", { className: "data-icon", dangerouslySetInnerHTML: { __html: dataIcon } }),
                React.createElement("span", null, data))));
};
const HourlyPanel = ({ hourly }) => {
    const precipitationStr = hourly.Precipitation;
    const showPreciptation = parseInt(precipitationStr) > 5;
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "forecast-list-item" },
            React.createElement("span", { className: "title" }, hourly.Hour),
            React.createElement("span", { className: "flex-row" },
                showPreciptation && React.createElement("span", { className: "precip" }, hourly.Precipitation),
                React.createElement("div", { className: "temp-icon", dangerouslySetInnerHTML: { __html: hourly.Icon } })),
            React.createElement("div", { className: "temp" }, hourly.Temp)));
};
const ForecastPanel = ({ forecast }) => {
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "forecast-list-item" },
            React.createElement("div", { className: "label" }, forecast.Date),
            React.createElement("div", { className: "temp-icon", dangerouslySetInnerHTML: { __html: forecast.Icon } }),
            React.createElement("div", null,
                React.createElement("span", { className: "temp" },
                    React.createElement("span", null, forecast.High),
                    React.createElement("span", { className: "slash" }),
                    React.createElement("span", null, forecast.Low)))));
};
const Precipitation = ({ precipitation }) => {
    return React.createElement("div", { className: "precip" },
        React.createElement("svg", { className: "icon-drop", viewBox: "0 0 200 200", transform: "scale(4) translate(3, -3)" },
            React.createElement("use", { className: "svg-drop", href: "#svg-symbol-drop" })),
        React.createElement("span", null, precipitation));
};
exports.Precipitation = Precipitation;
const splitTime = (time) => {
    if (!time) {
        return { time: "", ampm: "" };
    }
    time = time.toLowerCase();
    const isAM = time.indexOf("am") > 0;
    const index = isAM ? time.indexOf("am") : time.indexOf("pm");
    return {
        time: time.slice(0, index).trim(),
        ampm: isAM ? "AM" : "PM"
    };
};
exports.splitTime = splitTime;
