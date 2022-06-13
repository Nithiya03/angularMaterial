import { Component, Inject, OnInit , ViewChild } from '@angular/core';
import { MatDialog,  MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from './dialog/dialog.component';
import { ServiceService } from './service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { inject } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  showFiller = false;
  title = 'angularMaterial';
  displayedColumns: string[] = ['productName', 'category', 'price', 'comment','date','freshness','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog,
              private service:ServiceService,
              private _snackBar:MatSnackBar) {}
              
  ngOnInit(): void {
    this.getAllProduct();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val =>{
      if(val == 'save'){
        this.getAllProduct();
      }
    })
  }

  getAllProduct(){
    this.service.getProduct().subscribe({
      next:(res)=>{
        console.log(res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        this._snackBar.open("Error while fetching the records","ok")
      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row :any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val =>{
      if(val == 'update'){
        this.getAllProduct()
      }
    })
  }

  deleteProduct(id : number){
    this.service.deleteProduct(id).subscribe({
      next:(res)=>{
        this._snackBar.open("Product deleted successfully","ok");
        this.getAllProduct();
      },
      error:()=>{
        this._snackBar.open("Error while deleting the product","ok")
      }
    })
  }
}

