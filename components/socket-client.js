import io from 'socket.io-client';
import { SOCKET_PORT, SOCKET_GLOBAL_URL, SOCKET_LOCAL_URL } from '@/lib/variables';

const SOCKET_URL = `${SOCKET_GLOBAL_URL}:${SOCKET_PORT}` ?? `${SOCKET_LOCAL_URL}:${SOCKET_PORT}`;

export const socket = io(SOCKET_URL);