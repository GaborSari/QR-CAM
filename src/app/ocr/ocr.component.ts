import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css']
})
export class OcrComponent implements OnInit, AfterViewInit {
  @ViewChild('webcamContainer') webcamContainer?: ElementRef;

  constructor() { }

  initError = false;
  webcamVisible = false;
  width = 250;
  height = 250;
  processing = false;
  allowCameraSwitch = false;
  multipleWebcamsAvailable = false;
  deviceId!: string;
  videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  ngOnInit(): void {
      
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  ngAfterViewInit(): void {
      console.log(this.webcamContainer?.nativeElement.clientHeight)
      console.log(this.webcamContainer?.nativeElement.clientWidth)
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }


  handleInitError(error: WebcamInitError): void {
    this.initError = true;
    console.error(error);
  }


  showNextWebcam(directionOrDeviceId: boolean | string = true): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage): void {
    this.processing = true;
    console.info('received webcam image', webcamImage);
    /*Tesseract.recognize(webcamImage.imageAsDataUrl, 'eng').then(({ data: { text } }) => {
      this.dialogRef.close(text);
    });*/
  }

  cameraWasSwitched(deviceId: string | any): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
