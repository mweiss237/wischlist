

export const parseAndActivateLinks = (text: string) => {
    const urlRegex =
        /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g
   


    return text.replaceAll(urlRegex, (substr) => {
        const visibleLink = substr
        return `<a href="${substr}" target="_blank">(Link)</a>`
    })
}
