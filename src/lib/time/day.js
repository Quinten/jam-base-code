// returns a number in the form 20241203
export default (offset = 0) => {
    let today = new Date();
    // offset is in days
    today.setDate(today.getDate() + offset);
    let yyyy = String(today.getFullYear()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    return Number(yyyy + mm + dd);
}
