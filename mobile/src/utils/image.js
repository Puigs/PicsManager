function getImageSize(base64String) {
    var stringLength = base64String.length - 'data:image/png;base64,'.length;
    var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
    return sizeInBytes / 1000
}


export {
    getImageSize
}