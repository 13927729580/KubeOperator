import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CredentialService} from '../credential.service';
import {Credential} from './credential';
import {HostDetailComponent} from '../../host/host-detail/host-detail.component';
import {CommonAlertService} from '../../base/header/common-alert.service';
import {AlertLevels} from '../../base/header/components/common-alert/alert';

@Component({
  selector: 'app-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: ['./credential-list.component.css']
})
export class CredentialListComponent implements OnInit {

  items: Credential[] = [];
  selected: Credential[] = [];
  loading = true;
  @Output() add = new EventEmitter();
  @ViewChild(HostDetailComponent, {static: false})
  child: HostDetailComponent;
  showDelete = false;
  resourceTypeName: '凭据';

  constructor(private credentialService: CredentialService, private alertService: CommonAlertService) {
  }

  ngOnInit() {
    this.listItems();
  }

  listItems() {
    this.loading = true;
    this.credentialService.listCredential().subscribe(data => {
      this.items = data;
      this.loading = false;
    });
  }

  delete() {
    const promises: Promise<{}>[] = [];
    this.selected.forEach(item => {
        promises.push(this.credentialService.deleteCredential(item.name).toPromise());
      }
    );
    Promise.all(promises).then(data => {
      this.alertService.showAlert('删除成功', AlertLevels.SUCCESS);
    }).finally(
      () => {
        this.showDelete = false;
        this.selected = [];
        this.listItems();
      }
    );
  }

  refresh() {
    this.listItems();
  }

  addItem() {
    this.add.emit();
  }

}
