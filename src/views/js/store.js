async function spawnItem(item, credits) {
    await fetch(`/store?object=${item}&quantity=1&cost=${credits}`, {
        method: "POST"
    }).then(res => {
        res.status(200);
    }).catch((error) => {
        console.error(error);
        return;
    });
}