function spawnItem(item, credits) {
    fetch(`/store?object=${item}&quantity=1&cost=${credits}`, {
        method: "POST"
    }).catch((error) => {
        console.error(error);
        return;
    });
}