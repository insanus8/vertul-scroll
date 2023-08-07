const list = Array.from(Array(42).keys())

class VertulList {
    _list = []
    _heightRow = 0
    _active = 0
    _visibleRows = 0
    _start = 0

    html = {
        list: null,
        item: []
    }
    isScroll = true
    scrollTop = 0
    constructor({ box, list, heightRow, gap, colums, active }) {
        this.box = box
        this.list = list
        this.gap = gap ?? 0
        this.colums = colums ?? 1
        this.heightRow = heightRow ?? 0
        this.render()
        this.vertulScroll()
        this.handelScroll = (e) => {
            if ( !this.isScroll || e.timeStamp - this.timeStampScroll <= 17 ) {
                this.box.scrollTop = this.scrollTop
                return
            }
            const active = Math.floor( this.box.scrollTop / this.heightRow ) * this.colums
    
            const start = Math.min(
                Math.ceil( (this.list.length - (this.visibleRows * colums) - (2 * colums)) ),
                active < 0 ? 0 : active
            )
            this.scrollTop = this.box.scrollTop
            this.isScroll = false
            this.start = start
            this.timeStampScroll = e.timeStamp
            this.isScroll = true
        }
    
        this.box.addEventListener('scroll', this.handelScroll, true)

        this.active = active ?? 0
    }

    get list() {
        return this._list
    }

    set list(arr) {
        this._list = arr
    }

    get heightRow() {
        return this._heightRow
    }

    set heightRow(number) {
        this._heightRow = number + this.gap
        this.visibleRows = Math.ceil(this.box.clientHeight / this.heightRow)  
    }

    get start() {
        return this._start
    }

    set start(number) {
        this._start = number
        this.vertulScroll()
    }

    get active() {
        return this._active
    }

    calculateCordinatActive() {
        if (this.active === 0) return 0
        if (Math.floor( (this.active) / this.colums ) - 1 === 0)  return this.heightRow
        const cordinat = (this.heightRow *  Math.floor( (this.active) / this.colums ))
        return cordinat
    }

    set active(number) {
        this._active = number > this.list.length ? this.list.length : number
        const cordinat = this.calculateCordinatActive()


        this.box.scrollTo({
            top: cordinat,
            behavior: "smooth"
        })
    }

    margin() {
        const colums = Array.from(Array(this.colums).keys())

        for (let i = 0; i < colums.length; i++) {
            const lastIndex = this.html.item.length - 1 - i
            this.html.item[i].style.marginTop = `${this.getTopHeight()}px`
            this.html.item[lastIndex].style.marginBottom = `${this.getBottomHeight()}px`
        }
    }

    activeIndexArray() {
        const startCeil = Math.ceil( this.start )
        return this.list.slice(startCeil , startCeil + (this.visibleRows * this.colums) + (2 * this.colums))
    }


    vertulScroll() {
        const activeIndexArray = this.activeIndexArray()
        this.margin()
        for (let i = 0; i < activeIndexArray.length; i++) {
            const el = activeIndexArray[i]
            this.html.item[i].textContent = el
        }
    }

    render() {
        this.html.list = document.createElement('ul')
        this.html.list.classList.add('number-list')

        for (let i = 0; i < (this.visibleRows + 2) * this.colums; i++) {
            const item = document.createElement('li')
            item.classList.add('number-list__item')
            this.html.list.append(item)
            this.html.item[i] = item
        }

        this.box.append(this.html.list)
    }

    getTopHeight() {
        return this.heightRow * (this.start / this.colums)
    }

    getBottomHeight() {
        const rowsNotVisible = (this.list.length / this.colums) - ((this.start / this.colums) + this.visibleRows + 2)
        console.log(rowsNotVisible);
        return (rowsNotVisible * this.heightRow)
    }
}

const a = new VertulList({
    box: document.querySelector('.big'),
    list,
    heightRow: 100,
    gap: 50,
    colums: 3,
    active: 41,
})