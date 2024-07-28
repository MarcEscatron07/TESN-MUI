export const postLogin = async (formData) => {
    return await fetch('/api/login', {
        method: 'POST',
        body: formData,
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}

export const getUsers = async () => {
    return await fetch('/api/users', {
        method: 'GET'
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}

export const getPosts = async () => {
    return await fetch('/api/posts', {
        method: 'GET'
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}

export const getChats = async (params) => {
    return await fetch(`/api/chats${params ? `?${params}`:''}`, {
        method: 'GET'
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}

export const getThread = async (params) => {
    return await fetch(`/api/threads${params ? `?${params}`:''}`, {
        method: 'GET'
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}

export const postThread = async (formData) => {
    return await fetch('/api/threads', {
        method: 'POST',
        body: formData,
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}

export const postAttachments = async (formData) => {
    return await fetch('/api/attachments', {
        method: 'POST',
        body: formData,
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}

export const getLocalHolidays = async () => {
    return await fetch('/api/holidays', {
        method: 'GET'
    })
    .then(
        (res) => { return res.json(); }, (err) => { return err.json(); }
    ).catch((err) => {
        throw Error(err);
    })
}