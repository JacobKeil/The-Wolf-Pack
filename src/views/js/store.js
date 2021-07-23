function spawnItem(item, credits) {
    fetch(`/store?object=${item}&quantity=1&cost=${credits}`, {
        method: "POST"
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.error(error);
        return;
    });
}