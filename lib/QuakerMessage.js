const QuakerMessage = ({message, hour, minute}) => {
    if (!message || !hour || !minute) {
        return (<></>);
    }

    const militaryToNice = (hour, minute) => {
        if (minute < 10) {
            minute = `0${minute}`
        }

        if (hour == 0) {
            return `12:${minute} am`
        }
        else if (hour >= 1 && hour <= 11) {
            return `${hour}:${minute} am`
        }
        else if (hour >= 13 && hour <= 23) {
            return `${hour - 12}:${minute} pm` 
        }
        else {
            return `${hour}:${minute} pm`
        }
    };

    return (
        <div className="flex flex-col my-2">
            <div className="flex flex-row divide-x">
                <div className="p-1 pr-2 text-gray-600 font-bold">
                    <p>
                        Quaker
                    </p>
                </div>
                <div className="p-1 pl-2 text-gray-400">
                    <p>
                        {militaryToNice(hour, minute)}
                    </p>
                </div>
            </div>
            <div className="p-1 text-gray-600">
                <p>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default QuakerMessage;
