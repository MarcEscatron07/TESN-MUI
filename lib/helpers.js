import moment from 'moment-timezone';
import parse from 'html-react-parser';

export const formatFilesize = (value, decimals = 2) => {
    if (!+value) return '0 Bytes';

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(value) / Math.log(k))

    return `${parseFloat((value / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const formatDateTime = (value, format, props) => {
    if(value && moment(value).isValid()) {
        switch (props?.origin) {
            case 'post-timestamp':
                if(moment().diff(value, 'days') <= 10) {
                    return `${moment(value).fromNow(true)}${props?.suffix ?? ''}`;
                } else {
                    return `${moment(value).format(format)}`;
                }
            case 'chat-timestamp':
                if (moment(moment(value).format('MM/DD/YYYY')).isSame(moment().format('MM/DD/YYYY'))) {
                    return `Today ${moment(value).format('h:mm A')}`;
                } else {
                    return `${moment(value).format(format)}`;
                }
            default:
                return `${props?.prefix ?? ''}${moment(value).format(format)}${props?.suffix ?? ''}`;
        }
    } else {
        return value;
    }
}

export const parseStringToHtml = (value) => {
    return value ? parse(value) : value;
}