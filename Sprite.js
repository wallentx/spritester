"use strict";
/*
*  THE SPRITE CLASS REPRESENTS AN IMAGE ADDED TO THE APP.  IT KEEPS TRACK OF IT'S
*  X AND Y POSITION INSIDE THE CANVAS.  IT ALSO KEEPS TRACK OF HOW MUCH TRIMMING
*  THE APP HAS TO DO TO PLACE THIS IMAGE WITHIN THE PACKED CANVAS.
*
*  YOU CAN FIND TYPESCRIPT CODE THAT LOADS A TEXTURE ATLAS ON
*  MY WEBSITE:
*  http://www.typescriptgames.com
*
*  IF YOU HAVE ANY QUESTIONS, PLEASE TWEET ME @typescriptgames
*/
class Sprite {
    constructor(image) {
        this.x = 0;
        this.y = 0;
        this.name = "";
        this.offsetX = () => {
            return this.x - this.trimLeft;
        };
        this.offsetY = () => {
            return this.y - this.trimTop;
        };
        this.trimLeft = 0;
        this.trimRight = 0;
        this.trimTop = 0;
        this.trimBottom = 0;
        this.width = 0;
        this.height = 0;
        this.trimmedWidth = 0;
        this.trimmedHeight = 0;
        this.Area = () => {
            return this.width * this.height;
        };
        this.draw = () => {
            ctx.save();
            ctx.translate(this.offsetX(), this.offsetY());
            ctx.drawImage(this.image, 0, 0);
            ctx.restore();
        };
        this.name = image.id;
        this._buffer = document.createElement('canvas');
        this.x = 0;
        this.y = 0;
        this.width = image.naturalWidth;
        this.height = image.naturalHeight;
        this._buffer.width = this.width;
        this._buffer.height = this.height;
        this._btx = this._buffer.getContext('2d');
        this.image = image;
        this._btx.drawImage(this.image, 0, 0);
        var pixels = this._btx.getImageData(0, 0, this.width, this.height).data;
        for (var c = 0; c < this.image.naturalWidth; c++) {
            for (var r = 0; r < this.image.naturalHeight; r++) {
                var alpha_pos = ((r * this.image.naturalWidth) + c) * 4 + 3;
                if (pixels[alpha_pos] != 0) {
                    this.trimLeft = c - 1;
                    c = this.image.naturalWidth;
                    break;
                }
            }
        }
        for (c = this.image.naturalWidth - 1; c >= 0; c--) {
            for (r = 0; r < this.image.naturalHeight; r++) {
                var alpha_pos = ((r * this.image.naturalWidth) + c) * 4 + 3;
                if (pixels[alpha_pos] != 0) {
                    this.trimRight = c + 1;
                    c = -1;
                    break;
                }
            }
        }
        for (r = 0; r < this.image.naturalHeight; r++) {
            for (c = 0; c < this.image.naturalWidth; c++) {
                var alpha_pos = ((r * this.image.naturalWidth) + c) * 4 + 3;
                if (pixels[alpha_pos] != 0) {
                    this.trimTop = r - 1;
                    r = this.image.naturalHeight;
                    break;
                }
            }
        }
        for (r = this.image.naturalHeight - 1; r >= 0; r--) {
            for (c = 0; c < this.image.naturalWidth; c++) {
                var alpha_pos = ((r * this.image.naturalWidth) + c) * 4 + 3;
                if (pixels[alpha_pos] != 0) {
                    this.trimBottom = r + 1;
                    r = -1;
                    break;
                }
            }
        }
        this.trimRight += SpritePacker.PADDING;
        this.trimLeft -= SpritePacker.PADDING;
        this.trimBottom += SpritePacker.PADDING;
        this.trimTop -= SpritePacker.PADDING;
        this.trimmedWidth = this.trimRight - this.trimLeft;
        this.trimmedHeight = this.trimBottom - this.trimTop;
    }
}
