import { ScreenAreaEvent } from '../notification/Event';
import { ScreenAreaListener } from '../notification/Listeners';

export default class ScreenArea {
  private canvas: HTMLCanvasElement;
  private buffer: ImageData | null = null;
  private saveBuffer: ImageData | null = null;
  private listeners: ScreenAreaListener[] = [];

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const observer = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth | 0;
      canvas.height = canvas.clientHeight | 0;
      this.resized();
    });
    observer.observe(canvas);
  }

  public getCanvas() {
    return this.canvas;
  }

  public addListener(listener: ScreenAreaListener) {
    this.listeners.push(listener);
    const { width, height } = this.getDimensions();
    listener.notify(
      new ScreenAreaEvent(this, width, height, ScreenAreaEvent.RESIZED)
    );
  }

  private clearBuffer() {
    const { width, height } = this.getDimensions();
    if (this.buffer === null) {
      if (width > 0 && height > 0) {
        const arrayBuffer = new ArrayBuffer(width * height * 4);
        const pixels = new Uint8ClampedArray(arrayBuffer);
        this.buffer = new ImageData(pixels, width, height, {
          colorSpace: 'srgb',
        });
      }
    } else {
      this.buffer.data.fill(0);
      this.listeners.forEach((current) =>
        current.notify(
          new ScreenAreaEvent(this, width, height, ScreenAreaEvent.CLEARED)
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
        const { width, height } = this.getDimensions();
        this.saveBuffer = new ImageData(width, height, {
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
    const { width, height } = this.getDimensions();
    this.buffer = null;
    this.clearBuffer();
    this.listeners.forEach((current) =>
      current.notify(
        new ScreenAreaEvent(this, width, height, ScreenAreaEvent.RESIZED)
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

  private getDimensions() {
    const { width, height } = this.canvas.getBoundingClientRect();
    return { width: width | 0, height: height | 0 };
  }
}
