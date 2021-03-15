import { Injectable } from '@angular/core';
import {
  Action,
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction, DocumentSnapshotDoesNotExist, DocumentSnapshotExists
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

type FirestoreCollection<T> = string | AngularFirestoreCollection<T>;
type FirestoreDocument<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  generateId() {
    return this.angularFirestore.createId();
  }

  getDocument<T>(ref: FirestoreDocument<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.angularFirestore.doc<T>(ref) : ref;
  }

  getDocumentData<T>(ref: FirestoreDocument<T>): Observable<T> {
    return this.getDocument(ref)
      .snapshotChanges()
      .pipe(
        map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
          return doc.payload.data() as T;
        }),
      );
  }


  /*countInventory() {
    this.angularFirestore.collection('inventory', reference => reference.where('price', '==', 9900)).get()
      .subscribe(docs => console.log(docs));
  }*/


  createDocument(ref: string, type: string, data: any) {
    return this.getCollection(ref).add(data)
      .then(document => {
        console.log(document);
        return this.updateDocument(document.path, {[type + 'Id']: document.id});
      });
  }

  updateDocument<T>(ref: FirestoreDocument<T>, data: any): Promise<void> {
    return this.getDocument(ref).set(data, { merge: true });
  }

  deleteDocument<T>(ref: FirestoreDocument<T>): Promise<void> {
    return this.getDocument(ref).delete();
  }

  createDocumentWithCustomId<T>(ref: FirestoreDocument<T>, data: any): Promise<void> {
    return this.getDocument(ref).set(data);
  }

  createBatchOfDocumentsWithCustomId<T>(ref: FirestoreDocument<T>, idType: string, data: any[]): Promise<void> {
    const batch = this.angularFirestore.firestore.batch();
    data.forEach((arrayItem) => {
      batch.set(this.getDocument(`${ref}/${arrayItem[idType]}`).ref, arrayItem);
    });

    return batch.commit();
  }

  updateBatchOfDocumentsWithCustomId<T>(ref: FirestoreDocument<T>, idType: string, data: any[]): Promise<void> {
    const batch = this.angularFirestore.firestore.batch();
    data.forEach((arrayItem) => {
      batch.update(this.getDocument(`${ref}/${arrayItem[idType]}`).ref, arrayItem);
    });

    return batch.commit();
  }

  deleteBatchOfDocumentsWithCustomId<T>(ref: FirestoreDocument<T>, idType: string, data: any[]): Promise<void> {
    const batch = this.angularFirestore.firestore.batch();
    data.forEach((arrayItem) => {
      batch.delete(this.getDocument(`${ref}/${arrayItem[idType]}`).ref);
    });

    return batch.commit();
  }

  consistentDocumentUpdate<T>(ref: FirestoreDocument<T>, documentUpdateFunction: Function, parameters: any): Promise<void> {
    const documentRef = this.getDocument(ref).ref;
    return this.angularFirestore.firestore.runTransaction((transaction) => {
      return transaction.get(documentRef).then((document) => {
        const updatedDocument = documentUpdateFunction(document.data(), parameters);
        transaction.update(documentRef, updatedDocument);
      });
    });
  }

  getCollection<T>(ref: FirestoreCollection<T>, queryFn?: any): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.angularFirestore.collection<T>(ref, queryFn) : ref;
  }

  getCollectionDataAsArray<T>(ref: FirestoreCollection<T>, queryFn?: any): Observable<T[]> {
    return this.getCollection(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs: DocumentChangeAction<T>[]) => {
          return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
        }),
      );
  }


}
