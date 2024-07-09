import moment from 'moment-timezone';
import parse from 'html-react-parser';

export const formatFilesize = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const formatTimestamp = (value, format, origin) => {
    switch (origin) {
        case 'message-timestamp-title':
            if (moment(moment(value).format('MM/DD/YYYY')).isSame(moment().format('MM/DD/YYYY'))) {
                return 'Today ' + moment(value).format('h:mm A');
            } else {
                return moment(value).format(format);
            }
        default:
            return moment(value).format(format);
    }
}

export const parseStringToHtml = (value) => {
    return parse(value);
}