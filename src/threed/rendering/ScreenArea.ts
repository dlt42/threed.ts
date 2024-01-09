import { ScreenAreaEvent } from '../notification/Event';
import { ScreenAreaListener } from '../notification/Listeners';

export default class ScreenArea {
  private canvas: HTMLCanvasElement;
  private buffer: ImageData | null = null;
  private saveBuffer: ImageData | null = null;
  private listeners: ScreenAreaListener[] = [];
  private width: number;
  private height: number;

  public constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;
  }

  public getCanvas() {
    return this.canvas;
  }

  public addListener(listener: ScreenAreaListener) {
    this.listeners.push(listener);
    listener.notify(
      new ScreenAreaEvent(
        this,
        this.width,
        this.height,
        ScreenAreaEvent.RESIZED
      )
    );
  }

  private clearBuffer() {
    if (this.buffer === null) {
      if (this.width > 0 && this.height > 0) {
        const arrayBuffer = new ArrayBuffer(this.width * this.height * 4);
        const pixels = new Uint8ClampedArray(arrayBuffer);
        this.buffer = new ImageData(pixels, this.width, this.height, {
          colorSpace: 'srgb',
        });
      }
    } else {
      this.buffer.data.fill(0);
      this.listeners.forEach((current) =>
        current.notify(
          new ScreenAreaEvent(
            this,
            this.width,
            this.height,
            ScreenAreaEvent.CLEARED
          )
        )
      );
    }
  }

  public async getDataBuffer() {
    while (this.buffer === null) {
      try {
        await new Promise((r) => setTimeout(r, 1));
      } catch (e) {
        console.log(e);
      }
    }
    return this.buffer;
  }

  public refreshBuffer() {
    if (this.buffer !== null) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'blue';
        ctx.putImageData(this.buffer, 0, 0);
      }
      if (this.saveBuffer === null) {
        this.saveBuffer = new ImageData(this.width, this.height, {
          colorSpace: 'srgb',
        });
        this.saveBuffer?.data.set(this.buffer.data.slice(0));
      }
    }
    this.clearBuffer();
  }

  public removeListener(listener: ScreenAreaListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) this.listeners.splice(index, 1);
  }

  public resized() {
    this.buffer = null;
    this.clearBuffer();
    this.listeners.forEach((current) =>
      current.notify(
        new ScreenAreaEvent(
          this,
          this.width,
          this.height,
          ScreenAreaEvent.RESIZED
        )
      )
    );
  }

  public async getBuffer() {
    this.saveBuffer = null;
    let buf: ImageData | null = null;
    while (buf === null) {
      if (this.saveBuffer !== null) buf = this.saveBuffer;
      await new Promise((r) => setTimeout(r, 10));
    }
    return buf;
  }
}
