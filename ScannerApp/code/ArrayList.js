function ArrayList(arr) {
    this._elementData = arr || [];
}

var arrayListPrototype = {

    '_arrayPrototype': Array.prototype,

    '_getData': function () {
        return this._elementData;
    },

    'size': function () {
        return this._getData().length;
    },

    'isEmpty': function () {
        return this.size() === 0;
    },

    'contains': function (obj) {
        return this.indexOf(obj) > -1;
    },

    'indexOf': function (obj) {
        var i, data = this._getData(), length = data.length;
        for (i = 0; i < length; i++) {
            if (obj === data[i]) {
                return i;
            }
        }
        return -1;
    },

    'lastIndexOf': function (obj) {
        var i, data = this._getData(), length = data.length;
        for (i = length - 1; i > -1; i--) {
            if (obj === data[i]) {
                return i;
            }
        }
        return -1;
    },

    'get': function (index) {
        return this._getData()[index];
    },

    'set': function (index, element) {
        this._getData()[index] = element;
    },

    'addFromIndex': function (index, element) {
        if (index >= this.size()) {
            this._getData().push(element);
        } else {
            this._getData().splice(index, 0, element);
        }
        // if (element) {
        // this.set(index, element);
        // } else {
        //     return this._getData().push(index);
        // }
    },

    'addFromElement': function (element) {
        // let size=this.size();
        // if (element) {
        this._getData().push(element);
        // } else {
        //     return this._getData().push(size);
        // }
    },

    'remove': function (index) {
        var oldValue = this._getData()[index];
        this._getData()[index] = null;
        // 1.3 这怎么能光null不删除呢
        this._getData().splice(index, 1);
        return oldValue;
    },

    'clear': function () {
        this._getData().length = 0;
    },

    'addAll': function (index, array) {
        if (array) {
            this._getData().splice(index, 0, array);
        } else {
            this._arrayPrototype.push.apply(this._getData(), index);
        }
    }

};

ArrayList.prototype = arrayListPrototype;