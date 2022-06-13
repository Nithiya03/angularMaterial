import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from '../service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent implements OnInit {

  freshness=["Brand New","Second Hand","Refurbished"]
  category=["fruits","vegitables","electronics"]
  productForm!:FormGroup
  actionbtn:string="save"

  constructor(private fb:FormBuilder,
    private service:ServiceService,
    private _snackBar:MatSnackBar,
    private dialogref:MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData:any) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName:['',Validators.required],
      category:['',Validators.required],
      freshness:['',Validators.required],
      price:['',Validators.required],
      comment:['',Validators.required],
      date:['',Validators.required,]
    });

    if(this.editData){
      this.actionbtn = 'update'
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.service.postProduct(this.productForm.value).subscribe(
          {
            next:(res)=>{
              this._snackBar.open("Product Added successfully","ok")
              this.productForm.reset()
              this.dialogref.close("save")
            },
            error:()=>{
              this._snackBar.open("Error while Adding the Product","ok")
            }
          })
      }
    }else{
      this.updateData()
    }
  }

  updateData(){
    this.service.putProduct(this.productForm.value,this.editData.id).subscribe({ 
       next:(res)=>{
          this._snackBar.open("Product Updated Successfully","ok");
          this.productForm.reset();
          this.dialogref.close('update');
        },
        error:()=>{
          this._snackBar.open("Error while  Updating product","ok");
        }
      }
    )
  }
}
