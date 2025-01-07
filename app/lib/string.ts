export function decodeBase64UUID(str: string) {
    const urlUnsafe = str.replace(/-/g, '+').replace(/_/g, '/');
    const arr = atob(urlUnsafe).split('').map(c => {
        const char = c.charCodeAt(0);
        return ('0'+char.toString(16)).substr(-2,2);
    });
    arr.splice(4, 0, '-');
    arr.splice(7, 0, '-');
    arr.splice(10, 0, '-');
    arr.splice(13, 0, '-');
    return arr.join('').toLowerCase();
}

export function encodeBase64UUID(str: string) {
    return btoa(str.replace(/-/g, '').match(/\w{2}/g)!.map(a => {
        return String.fromCharCode(parseInt(a, 16));
    }).join('')).replace(/=*$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}