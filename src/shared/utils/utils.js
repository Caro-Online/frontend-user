export const removeItem = (array, id) => {
    let cloneArray = [...array]
    return cloneArray.filter(x => x._id !== id)
}