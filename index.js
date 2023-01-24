// create box
function createBox(absolutePos = false) {
    const newDiv = document.createElement('div');
    const newContent = document.createTextNode('Take me');
    newDiv.appendChild(newContent);
    newDiv.classList.add('box');
    if (absolutePos === true) {
        newDiv.style.position = 'absolute';
    }
    return newDiv;
}
// calculate position box
function positionBox(box, xPos, yPos) {
    const width = box.offsetWidth;
    const height = box.offsetHeight;
    const x =  xPos - width / 2;
    const y = yPos - height / 2;
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
}

const dragDrop = () => {
    // get element
    const startDrag = document.getElementById('box_move');
    const leftCollection = document.getElementById('left_collection');
    const rightCollection = document.getElementById('relative_right');
    const leftColumn = document.getElementById('left_column');
    const tmpBox = document.getElementById('tmp_box');

    function updatePosition () {
        tmpBox.style.visibility = 'hidden';
        tmpBox.style.left = startDrag.style.left;
        tmpBox.style.top = startDrag.style.top;
        tmpBox.style.visibility = 'visible';
    }
    updatePosition();
    let flagDrag = false;
    // start drag
    const mouseMove = function (e) {
        console.log('mouseMove');
        if (flagDrag === true) {
            positionBox(tmpBox, e.pageX, e.pageY);
        }
    };
    // start drag
    const mouseDown = function (e) {
        console.log('mouseDown');
        flagDrag = true;
        positionBox(tmpBox, e.pageX, e.pageY);
        document.body.addEventListener('pointermove', mouseMove);
    };
    // drop in right collection
    const mouseUpRightContainer = function (e) {
        console.log('mouseUpRight');
        if (flagDrag === true) {
            const item = createBox(true);
            const rect = rightCollection.getBoundingClientRect();
            let Y = e.pageY - rect.top;
            let X = e.pageX - rect.left;
            X = ((X - 30) * 100) / (rect.right - rect.left);
            Y = ((Y - 30) * 100) / (rect.bottom - rect.top);
            item.style.left = `${X}%`;
            item.style.top = `${Y}%`;
            rightCollection.appendChild(item);
        }
        flagDrag = false;
        updatePosition();
        document.body.removeEventListener('pointermove', mouseMove);
    };
    // check if we are inside left collection
    const checkIntersection = function (box, obj2) {
        const boxRect = box.getBoundingClientRect();
        const obj2Rect = obj2.getBoundingClientRect();
        if (
            boxRect.bottom > obj2Rect.top &&
            boxRect.right > obj2Rect.left &&
            boxRect.top < obj2Rect.bottom &&
            boxRect.left < obj2Rect.right
        ) {
            return true;
        }
        return false;
    };
    // drop left collection
    const mouseUpBox = function (e) {
        console.log('mouseUpBox');
        if (checkIntersection(this, leftColumn)) {
            const item = createBox();
            leftCollection.appendChild(item);
        } else if(checkIntersection(this, rightCollection)) {
            mouseUpRightContainer(e);
        }
        flagDrag = false;
        updatePosition();
        document.body.removeEventListener('pointermove', mouseMove);
    };
    tmpBox.addEventListener('pointerup', mouseUpBox);
    tmpBox.addEventListener('pointerdown', mouseDown);
};
dragDrop();
