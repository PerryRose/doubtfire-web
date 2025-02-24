import { Component, OnInit, Input, Inject } from '@angular/core';
import { alertService, commentsModal, Task } from 'src/app/ajs-upgraded-providers';
import { TaskComment } from 'src/app/api/models/doubtfire-model';
import { FileDownloaderService } from 'src/app/common/file-downloader/file-downloader';

@Component({
  selector: 'pdf-image-comment',
  templateUrl: './pdf-image-comment.component.html',
  styleUrls: [],
})
export class PdfImageCommentComponent implements OnInit {
  @Input() comment: TaskComment;
  @Input() project: any;
  @Input() task: any;

  public resourceUrl: string = undefined;

  constructor(
    @Inject(alertService) private alerts: any,
    @Inject(FileDownloaderService) private fileDownloaderService: FileDownloaderService,
    @Inject(commentsModal) private commentsModalRef: any,
    @Inject(Task) private TaskModel: any
  ) {}

  ngOnInit() {
    if (this.comment.commentType === 'image') this.downloadCommentResource();
  }

  private downloadCommentResource(fn?: (url: string) => void) {
    const url = this.TaskModel.generateCommentsAttachmentUrl(this.project, this.task, this.comment);

    this.fileDownloaderService.downloadBlob(
      url,
      ((blobUrl, response) => {
        this.resourceUrl = blobUrl;
        if (fn) fn(blobUrl);
      }).bind(this),
      ((error) => this.alerts.add('danger', `Unable to download image comment. ${error}`, 6000)).bind(this)
    );
  }

  public openCommentsModal() {
    if (this.resourceUrl) {
      this.commentsModalRef.show(this.resourceUrl, this.comment.commentType);
    } else {
      this.downloadCommentResource(this.openCommentsModal.bind(this));
    }
  }
}
