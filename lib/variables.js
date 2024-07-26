export const SITENAME_FULL = process.env.NEXT_PUBLIC_SITENAME_FULL ?? 'Tagbilaran Employees Social Network';
export const SITENAME_ABBR = process.env.NEXT_PUBLIC_SITENAME_ABBR ?? 'T.E.S.N.';
export const SITENAME_DESC = process.env.NEXT_PUBLIC_SITENAME_DESC ?? 'A social network system for the employees of the Tagbilaran City Hall';

export const SOCKET_PORT = process.env.NEXT_PUBLIC_SOCKET_PORT ?? 3000;
export const SOCKET_GLOBAL_URL = process.env.NEXT_PUBLIC_SOCKET_GLOBAL_URL ? `${process.env.NEXT_PUBLIC_SOCKET_GLOBAL_URL}:${SOCKET_PORT}` : null;
export const SOCKET_LOCAL_URL = process.env.NEXT_PUBLIC_SOCKET_LOCAL_URL ? `${process.env.NEXT_PUBLIC_SOCKET_LOCAL_URL}:${SOCKET_PORT}` : `http://localhost:${SOCKET_PORT}`;

export const GOOGLE_API_KEY = 'AIzaSyB3bSWUxCMTtVdIBZ7IeANLQiquvqQCDaw'; // marc.ticto@gmail.com > TESN > API Key
export const GOOGLE_PH_HOLIDAYS_CALENDAR_ID = 'en.philippines%23holiday%40group.v.calendar.google.com';