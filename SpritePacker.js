"use strict";
/*
*  THIS IS THE MAIN SPRITESTER CLASS, IT TAKES A CANVAS AND ADDS
*  TRIMMED IMAGES TO IT.  IT ALSO MANAGES GENERATING THE JSON
*  FILE THAT IS USED BY A GAME OR OTHER APPLICATION TO DETERMINE
*  WHERE THE IMAGES WERE PLACED.
*
*  TRY OUT THE APP ON http://www.spritester.com
*
*  YOU CAN FIND TYPESCRIPT CODE THAT LOADS A TEXTURE ATLAS ON
*  MY WEBSITE:
*  http://www.typescriptgames.com
*
*  IF YOU HAVE ANY QUESTIONS, PLEASE TWEET ME @typescriptgames
*/
class SpritePacker {
    constructor(canvas) {
        this.spriteList = new Array();
        this.pow2 = true;
        this._halfBinWidth = 0;
        this._packHeight = 0;
        this._leftHeight = 0;
        this._rightHeight = 0;
        this._sortSpriteW = (s1, s2) => {
            return s1.trimmedWidth - s2.trimmedWidth;
        };
        this._sortSpriteH = (s1, s2) => {
            //return s1.trimmedHeight - s2.trimmedHeight;
            return s2.trimmedHeight - s1.trimmedHeight;
        };
        this.draw = () => {
            var draw_sprite;
            for (var i = 0; i < this.spriteList.length; i++) {
                draw_sprite = this.spriteList[i];
                draw_sprite.draw();
            }
        };
        this.addSprite = (sprite) => {
            this.spriteList.push(sprite);
        };
        this.package = () => {
            debugger;
            var unplaced = this.spriteList.slice();
            unplaced.sort(this._sortSpriteW);
            if (unplaced.length > 0) {
                while (unplaced[unplaced.length - 1].width > this.canvas.width) {
                    if (this.pow2) {
                        this.canvas.width *= 2;
                    }
                    else {
                        this.canvas.width = unplaced[unplaced.length - 1].width;
                    }
                    this._halfBinWidth = this.canvas.width / 2;
                }
            }
            this._packHeight = this._rightHeight = this._leftHeight = this._widthPack(unplaced);
            while (this._packHeight > this.canvas.height) {
                if (this.pow2) {
                    this.canvas.height *= 2;
                }
                else {
                    this.canvas.height = this._packHeight;
                }
            }
            unplaced.sort(this._sortSpriteH);
            this._heightPack(unplaced);
            while (this._packHeight > this.canvas.height) {
                if (this.pow2) {
                    this.canvas.height *= 2;
                }
                else {
                    this.canvas.height = this._packHeight;
                }
            }
            while (unplaced.length > 0) {
                if (this._leftHeight < this._rightHeight) {
                    this._heightPackLeft(unplaced);
                }
                else {
                    this._heightPackRight(unplaced);
                }
                while (this._leftHeight > this.canvas.height) {
                    if (this.pow2) {
                        this.canvas.height *= 2;
                    }
                    else {
                        this.canvas.height = this._leftHeight;
                    }
                }
                while (this._rightHeight > this.canvas.height) {
                    if (this.pow2) {
                        this.canvas.height *= 2;
                    }
                    else {
                        this.canvas.height = this._rightHeight;
                    }
                }
            }
            var jsondata = {};
            jsondata.frames = {};
            jsondata.meta = {};
            jsondata.meta.app = "http://www.spritester.com";
            jsondata.meta.version = "0.3";
            for (var i = 0; i < this.spriteList.length; i++) {
                var temp_sprite = this.spriteList[i];
                jsondata.frames[temp_sprite.name] = new Frame(new Rectangle(temp_sprite.x, temp_sprite.y, temp_sprite.trimmedWidth, temp_sprite.trimmedHeight), //frame: Rectangle,
                new Rectangle(temp_sprite.trimRight, temp_sprite.trimTop, temp_sprite.trimmedWidth, temp_sprite.trimmedHeight), // spriteSourceSize: Rectangle,
                temp_sprite.width, //sourceW: number,
                temp_sprite.height); //sourceH: number);
            }
            // jsontxt
            var jsontxt = document.getElementById("jsontxt");
            jsontxt.textContent = JSON.stringify(jsondata);
        };
        this._heightPack = (unplaced) => {
            unplaced.sort(this._sortSpriteH);
            var packed_width = 0;
            var temp_sprite;
            for (var i = 0; i < unplaced.length; i++) {
                temp_sprite = unplaced[i];
                if (i == 0) {
                    this._leftHeight += temp_sprite.trimmedHeight;
                }
                if (temp_sprite.trimmedWidth < this.canvas.width - packed_width) {
                    temp_sprite.x = packed_width;
                    temp_sprite.y = this._packHeight;
                    packed_width += temp_sprite.trimmedWidth;
                    if (temp_sprite.x < this._halfBinWidth && packed_width >= this._halfBinWidth) {
                        this._rightHeight = this._packHeight + temp_sprite.trimmedHeight;
                    }
                    unplaced.splice(i, 1);
                }
            }
            while (this._rightHeight > this.canvas.height) {
                if (this.pow2) {
                    this.canvas.height *= 2;
                }
                else {
                    this.canvas.height = this._rightHeight;
                }
            }
            while (this._leftHeight > this.canvas.height) {
                if (this.pow2) {
                    this.canvas.height *= 2;
                }
                else {
                    this.canvas.height = this._leftHeight;
                }
            }
            if (this._leftHeight > this._packHeight) {
                this._packHeight = this._leftHeight;
            }
            if (this._rightHeight > this._packHeight) {
                this._packHeight = this._rightHeight;
            }
        };
        this._heightPackLeft = (unplaced) => {
            var packed_width = 0;
            var temp_sprite;
            var start_height = this._leftHeight;
            for (var i = 0; i < unplaced.length; i++) {
                temp_sprite = unplaced[i];
                if (i == 0) {
                    this._leftHeight += temp_sprite.trimmedHeight;
                }
                if (temp_sprite.trimmedWidth < this._halfBinWidth - packed_width) {
                    temp_sprite.x = packed_width;
                    temp_sprite.y = start_height;
                    packed_width += temp_sprite.trimmedWidth;
                    unplaced.splice(i, 1);
                }
            }
            while (this._leftHeight > this.canvas.height) {
                if (this.pow2) {
                    this.canvas.height *= 2;
                }
                else {
                    this.canvas.height = this._leftHeight;
                }
            }
        };
        this._heightPackRight = (unplaced) => {
            var packed_width = 0;
            var temp_sprite;
            var start_height = this._rightHeight;
            for (var i = 0; i < unplaced.length; i++) {
                temp_sprite = unplaced[i];
                if (i == 0) {
                    this._rightHeight += temp_sprite.trimmedHeight;
                }
                if (temp_sprite.trimmedWidth < this._halfBinWidth - packed_width) {
                    temp_sprite.x = packed_width + this._halfBinWidth;
                    temp_sprite.y = start_height;
                    packed_width += temp_sprite.trimmedWidth;
                    unplaced.splice(i, 1);
                }
            }
            while (this._rightHeight > this.canvas.height) {
                if (this.pow2) {
                    this.canvas.height *= 2;
                }
                else {
                    this.canvas.height = this._rightHeight;
                }
            }
        };
        this._widthPack = (unplaced) => {
            var pack_height = 0;
            var temp_sprite;
            if (unplaced.length == 0) {
                return;
            }
            temp_sprite = unplaced.pop();
            while (temp_sprite != null && temp_sprite.trimmedWidth >= this._halfBinWidth) {
                temp_sprite.x = 0;
                temp_sprite.y = pack_height;
                pack_height += temp_sprite.trimmedHeight;
                temp_sprite = unplaced.pop();
                while (pack_height > this.canvas.height) {
                    if (this.pow2) {
                        this.canvas.height *= 2;
                    }
                    else {
                        this.canvas.height = pack_height;
                    }
                }
            }
            if (temp_sprite != null) {
                unplaced.push(temp_sprite);
            }
            return pack_height;
        };
        if (SpritePacker.SINGLETON == null) {
            SpritePacker.SINGLETON = this;
        }
        else {
            delete this;
            return;
        }
        this.canvas = canvas;
        this.canvas.width = 256;
        this.canvas.height = 128;
        this._halfBinWidth = this.canvas.width / 2;
    }
    CanvasPow2(pow2) {
        var right_edge = this._findRightEdge();
        var bottom_edge = this._findBottomEdge();
        this.pow2 = pow2;
        if (pow2) {
            this.canvas.width = 256;
            this.canvas.height = 128;
            while (this.canvas.width < right_edge) {
                this.canvas.width *= 2;
            }
            while (this.canvas.height < bottom_edge) {
                this.canvas.height *= 2;
            }
        }
        else {
            this.canvas.width = right_edge;
            this.canvas.height = bottom_edge;
        }
        this._halfBinWidth = this.canvas.width / 2;
    }
    _findRightEdge() {
        var right_edge = 0;
        var s;
        for (var i = 0; i < this.spriteList.length; i++) {
            s = this.spriteList[i];
            if (right_edge < s.x + s.trimmedWidth) {
                right_edge = s.x + s.trimmedWidth;
            }
        }
        return right_edge;
    }
    _findBottomEdge() {
        var bottom_edge = 0;
        var s;
        for (var i = 0; i < this.spriteList.length; i++) {
            s = this.spriteList[i];
            if (bottom_edge < s.y + s.trimmedHeight) {
                bottom_edge = s.y + s.trimmedHeight;
            }
        }
        return bottom_edge;
    }
}
SpritePacker.SINGLETON = null;
SpritePacker.PADDING = 1;
