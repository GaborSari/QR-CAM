import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { CameraDevice } from 'html5-qrcode/esm/core';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements AfterViewInit {
  private readonly aspectRatio = 1.333;
  selectedCameraIndex = 0;
  cameraDevices: Array<CameraDevice> = [];
  html5QrCode?:Html5Qrcode ;
  loading = true;
  initError = false;

  @ViewChild('webcam') webcam?: ElementRef;

  debug:string ='';
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.loading = true;
    this.initQrcodeScanner(this.cameraDevices[this.selectedCameraIndex]);
  }

  constructor() { }

  ngAfterViewInit(): void {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length > 0) {
          this.cameraDevices = devices;
          this.initQrcodeScanner(devices[this.selectedCameraIndex]);
        } else {
          this.initError = true;
        }
      })
      .catch(this.handleCameraFailure.bind(this));
  }

  handleCameraFailure(err: any) {
    console.error(err);
    this.initError = true;
  }

  onScanSuccess(decodedText: any, decodedResult: any) {
    console.log('onScanSuccess')
    //this.html5QrCode?.clear();
  }

  onScanError(e:string) {
    console.log(e);
    if(e == 'QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code.')
    {
      this.debug += 'e';
      return
    }
    this.debug += e;
  }


  initQrcodeScanner(selectedCameraDevice: CameraDevice | undefined) {
    if (!selectedCameraDevice || !this.webcam) {
      return;
    }
    this.html5QrCode = new Html5Qrcode('webcam');
    let height = (this.webcam.nativeElement as HTMLElement).offsetHeight;
    let width = (this.webcam.nativeElement as HTMLElement).offsetWidth;
    let minDimension = Math.min(width, height);
    if (minDimension == width) {
      height = Math.floor(width / this.aspectRatio);
    } else {
      width = Math.floor(height * this.aspectRatio);
    }
    minDimension = Math.min(width, height);
    const qrBox =  Math.floor(minDimension * 0.65);

    this.html5QrCode
      .start(
        selectedCameraDevice.id,
        {
          qrbox: { width: qrBox, height: qrBox },
          fps: 10,
        },
        this.onScanSuccess.bind(this), undefined
      )
      .then(() => {
        this.loading = false;
      });
  }

  switchCamera() {
    console.log(this.selectedCameraIndex)
    this.selectedCameraIndex++;
    this.selectedCameraIndex = this.selectedCameraIndex % this.cameraDevices.length;
    this.initQrcodeScanner(this.cameraDevices[this.selectedCameraIndex]);
  }
}
