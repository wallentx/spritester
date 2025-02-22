"use strict";
/*
*  I HAVE TWO CLASSES IN THIS FILE.  THE MAIN ONE IS THE FRAME.  A TEXTURE ATLAS
*  IS A COLLECTION OF FRAMES INSIDE A PNG FILE AND JSON FILE.  THESE FRAMES WILL
*  BE WRITTEN AS TEXT IN THE JSON FILE.
*
*  YOU CAN FIND TYPESCRIPT CODE THAT LOADS A TEXTURE ATLAS ON
*  MY WEBSITE:
*  http://www.typescriptgames.com
*
*  IF YOU HAVE ANY QUESTIONS, PLEASE TWEET ME @typescriptgames
*/
class Frame {
    constructor(frame, spriteSourceSize, sourceW, sourceH) {
        this.rotated = false;
        this.trimmed = true;
        this.sourceSize = {};
        this.frame = frame;
        this.spriteSourceSize = spriteSourceSize;
        this.sourceSize.w = sourceW;
        this.sourceSize.h = sourceH;
    }
}
/*
 * THE RECTANGLE CLASS HAS AN X, Y, WIDTH AND HEIGHT VARIABLE, AND WILL
 * BE WRITTEN INTO THE JSON FILE WHEN THE TEXTURE ATLAS IS GENERATED
 */
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
