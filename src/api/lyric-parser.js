const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

export default class Lyric {
  /**
   *
   * @param {String} lrc raw lyric
   * @param {Function} handler handle play lyric
   */
  constructor(lrc, handler = () => {}) {
    this.lrc = lrc;
    this.lines = [];
    this.handler = handler;
    this.state = STATE_PAUSE;
    this.curLineIdx = 0;
    this.startStamp = 0;
    this.timer = null;

    this._initLines();
  }

  play(offest = 0, isSeek = false) {
    if (!this.lines.length) return;
    this.state = STATE_PLAYING;
    this.curLineIdx = this._findCurLineIndex(offest);
    this._callHandler(this.curLineIdx - 1);
    this.startStamp = +new Date() - offest;

    if (this.curLineIdx < this.lines.length) {
      clearTimeout(this.timer);
      this._playRest();
    }
  }

  stop() {
    this.state = STATE_PAUSE;
    clearTimeout(this.timer);
  }

  togglePlay() {
    if (this.state === STATE_PLAYING) this.stop();
    else this.play();
  }

  seek(offset) {
    this.play(offset, true);
  }

  _initLines() {
    const lines = this.lrc.split("\n");
    lines.forEach((line, idx) => {
      const result = timeExp.exec(line);
      if (!result) return;
      const txt = line.replace(timeExp, "").trim();
      if (txt) {
        if (result[3].length === 3) result[3] = result[3] / 10;
        this.lines.push({
          time:
            result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
          txt,
        });
      }
    });
    this.lines.sort((a, b) => a.time - b.time);
  }

  _findCurLineIndex(time) {
    for (let i = 0; i < this.lines.length; i++)
      if (time <= this.lines[i].time) return i;
    return this.lines.length - 1;
  }

  _callHandler(i) {
    if (i < 0) return;
    this.handler({ txt: this.lines[i].txt, lineNum: i });
  }

  _playRest(isSeek = false) {
    const line = this.lines[this.curLineIdx];
    let delay;
    if (isSeek) delay = line.time - (+new Date() - this.startStamp);
    else {
      const preTime = this.lines[this.curLineIdx - 1]
        ? this.lines[this.curLineIdx - 1].time
        : 0;
      delay = line.time - preTime;
    }

    this.timer = setTimeout(() => {
      this._callHandler(this.curLineIdx++);
      if (this.curLineIdx < this.lines.length && this.state === STATE_PLAYING)
        this._playRest();
    }, delay);
  }
}
