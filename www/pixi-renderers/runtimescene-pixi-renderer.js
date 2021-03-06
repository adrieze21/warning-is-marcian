
gdjs.RuntimeScenePixiRenderer = function(runtimeScene, runtimeGameRenderer)
{
    this._pixiRenderer = runtimeGameRenderer ?
        runtimeGameRenderer.getPIXIRenderer() : null;
    this._runtimeScene = runtimeScene;
    this._pixiContainer = new PIXI.Container(); //The Container meant to contains all pixi objects of the scene.
}

gdjs.RuntimeSceneRenderer = gdjs.RuntimeScenePixiRenderer; //Register the class to let the engine use it.

gdjs.RuntimeScenePixiRenderer.prototype.onCanvasResized = function() {
    if (!this._pixiRenderer) return;

    var runtimeGame = this._runtimeScene.getGame();
    this._pixiContainer.scale.x = this._pixiRenderer.width / runtimeGame.getDefaultWidth();
    this._pixiContainer.scale.y = this._pixiRenderer.height / runtimeGame.getDefaultHeight();
};

gdjs.RuntimeScenePixiRenderer.prototype.render = function() {
    if (!this._pixiRenderer) return;

    //this._renderProfileText(); //Uncomment to display profiling times

    // render the PIXI container of the scene
    this._pixiRenderer.backgroundColor = this._runtimeScene.getBackgroundColor();
    this._pixiRenderer.render(this._pixiContainer);
};

gdjs.RuntimeScenePixiRenderer.prototype._renderProfileText = function() {
    if (!this._profilerText) {
        this._profilerText = new PIXI.Text(' ', {align:"left", stroke: '#FFF', strokeThickness: 1});
        this._pixiContainer.addChild(this._profilerText);
    }

    var average = this._runtimeScene._profiler.getAverage();
    var total = Object.keys(average).reduce(function(sum, key) {
        return sum + (key !== 'total' ? average[key] : 0);
    }, 0);

    var text = '';
    for (var p in average) {
        text += p + ': ' + average[p].toFixed(2) +'ms' + '('+(average[p]/total*100).toFixed(1)+'%)\n';
    }

    this._profilerText.text = text;
};

gdjs.RuntimeScenePixiRenderer.prototype.hideCursor = function() {
    this._pixiRenderer.view.style.cursor = 'none';
}

gdjs.RuntimeScenePixiRenderer.prototype.showCursor = function() {
    this._pixiRenderer.view.style.cursor = '';
}

gdjs.RuntimeScenePixiRenderer.prototype.getPIXIContainer = function() {
    return this._pixiContainer;
}
