const cssClasses = {
    header: "dateHeader",
    timeCell: "timeCell",
    dateCell: "dateCell"
}

interface DateProps
{
    dates: Date[];
    showTimeCells: boolean;
}

interface DateRowProps 
{
    dateString: string;
    span: number;
}

class DateHeader extends React.Component<DateProps>
{
    public render(): React.ReactNode
    {
        const dates = this.props.dates;

        let lastDateRowProp: DateRowProps | undefined;
        const dateRowProps: DateRowProps[] = [];
        dates.forEach(date =>
        {
            const dateString = DateUtils.getDayString(date);
            if (lastDateRowProp && lastDateRowProp.dateString === dateString)
            {
                lastDateRowProp.span++;
            } else
            {
                lastDateRowProp = {
                    dateString: dateString,
                    span: 1
                }
                dateRowProps.push(lastDateRowProp);
            }
        });

        const dateCells = dateRowProps.map(props =>
        {
            return <td className={cssClasses.dateCell} colSpan={props.span}>
                {props.dateString}
            </td>;
        });

        let timeCells: JSX.Element[] = [];
        if (this.props.showTimeCells)
        {
            timeCells = dates.map(date =>
            {
                return <td className={cssClasses.timeCell}>{DateUtils.getTimeString(date)}</td>;
            });
        }

        return <table className={cssClasses.header}>
            <tr>{dateCells}</tr>
            <tr>{timeCells}</tr>
        </table>;
    }
}