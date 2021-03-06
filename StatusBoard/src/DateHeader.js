"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHeader = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
const cssClasses = {
    header: "dateHeader",
    timeCell: "timeCell",
    dateCell: "dateCell"
};
class DateHeader extends React.Component {
    render() {
        const dates = this.props.dates;
        let lastDateRowProp;
        const dateRowProps = [];
        dates.forEach(date => {
            const dateString = DateUtils_1.DateUtils.getDayString(date);
            if (lastDateRowProp && lastDateRowProp.dateString === dateString) {
                lastDateRowProp.span++;
            }
            else {
                lastDateRowProp = {
                    dateString: dateString,
                    span: 1
                };
                dateRowProps.push(lastDateRowProp);
            }
        });
        const dateCells = dateRowProps.map(props => {
            return React.createElement("td", { className: cssClasses.dateCell, colSpan: props.span }, props.dateString);
        });
        let timeCells = [];
        if (this.props.showTimeCells) {
            timeCells = dates.map(date => {
                return React.createElement("td", { className: cssClasses.timeCell }, DateUtils_1.DateUtils.getTimeString(date));
            });
        }
        return React.createElement("table", { className: cssClasses.header },
            React.createElement("tr", null, dateCells),
            React.createElement("tr", null, timeCells));
    }
}
exports.DateHeader = DateHeader;
