/**
 * Created by artizan.he on 2016/3/28.
 */
this.cropCanvas.getContext('2d').drawImage(
    this.buffer,
    bounds.left,
    bounds.top,
    Math.max(bounds.getWidth(), 1),
    Math.max(bounds.getHeight(), 1),
    0,
    0,
    bounds.getWidth(),
    bounds.getHeight()
);
