import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
type Props={
  createNew:()=>void,
  closeModalAdd:()=>void,
  handleChangeInput:(e:React.ChangeEvent<HTMLInputElement>)=>void,
  publishNew:()=>void,
  tiding:{
    id:number,
    title:string,
    img:string,
    create_at:string,
    status:string,
  }
}
export default function ModalAdd({createNew,closeModalAdd,handleChangeInput,publishNew,tiding}:Props) {
  return (
    <div className='modal'>
       <Form className='formModal'>
       <i onClick={closeModalAdd} className="fa-solid fa-xmark"></i>
      <Form.Group className="mb-3" controlId="">
        <Form.Label>Tên bài viết</Form.Label>
        <Form.Control required onChange={handleChangeInput} name='title' type="text" placeholder="Enter Name" value={tiding.title}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="">
        <Form.Label>Hình ảnh</Form.Label>
        <Form.Control required onChange={handleChangeInput} name='img' type="text" placeholder="Image" value={tiding.img} />
      </Form.Group>
      <div>
      <Button onClick={createNew} type='submit' variant="outline-danger">Làm mới</Button>{' '}
      <Button onClick={publishNew} type='submit' variant="outline-danger">Xuất bản</Button>{' '}
      </div>
    </Form>
    </div>
  )
}
