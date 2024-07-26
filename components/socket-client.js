import io from 'socket.io-client';
import { SOCKET_GLOBAL_URL, SOCKET_LOCAL_URL } from '@/lib/variables';

const SOCKET_URL = SOCKET_GLOBAL_URL ?? SOCKET_LOCAL_URL;

export const socket = io(SOCKET_URL, {
    rejectUnauthorized: false,
    withCredentials: false,
    extraHeaders: {
        "Access-Control-Allow-Origin": '*'
    }
});