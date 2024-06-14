import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import ModalDelete from './ModalDelete';
import ModalAdd from './ModalAdd';
import Loading from './Loading';
type New={
  id:number,
  title:string,
  img:string,
  create_at:string,
  status:string,
}
export default function GetAllNews() {
    //Initialization
    const [loader,setLoader]=useState<boolean>(false);
    const [NotFound,setNotFound]=useState<boolean>(false)
    const [valueLook,setValueLook]=useState<string>('');
    const [modalDelete,setModalDelete]=useState<boolean>(false);
    const [modalAdd,setModalAdd]=useState<boolean>(false);
    const [news,setNews]=useState<New[]>([]);
    const [tiding,setTiding]=useState<New>({
      id:Math.floor(Math.random()*100000000),
      title:'',
      img:'',
      create_at: new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear(),
      status:'unpublished',
    })
    const [typeSubmit,setTypeSubmit]=useState<string>('add');
    //function reset Tiding
    const reset=()=>{
      setTiding({
        id:Math.floor(Math.random()*100000000),
        title:'',
        img:'',
        create_at:'',
        status:'unpublished',
      })
    }
    //function load Data from API
    const loadData=()=>{
      axios.get(`http://localhost:1302/news?title_like=${valueLook}`)
      .then(res=>{
        (res.data.length>0)?setNotFound(false):setNotFound(true);     
        setNews(res.data);
      }
      )
      .catch((err)=>console.log(err))
    }
    //call load data at the first Mounting
    useEffect(()=>{
      loadData();
    },[valueLook]);
    // delete tiding
    const openModalDelete=(idTiding:number)=>{
      setTiding({...tiding,id:idTiding});
      setModalDelete(true);
    }
    const removeNewbyId=()=>{
      setLoader(true)
     axios.delete(`http://localhost:1302/news/${tiding.id}`)
     .then(()=>loadData())
     .catch(err=>console.log(err))
     setModalDelete(false);
     reset();
     setTimeout(() => {
      setLoader(false)
    },500);
    }
    const closeModalDelete=()=>{
      setModalDelete(false);
      reset();
    }
    //function set Button 
    const setButton=(status:string)=>{
        if(status==="unpublished"){
          return "outline-success"
        }else if(status==="published"){
          return "outline-info"
        }else{
          return "outline-danger"
        }
    }
    const contentButton=(status:string)=>{
      if(status==="unpublished"){
        return "Chưa xuất bản"
      }else if(status==="published"){
        return "Đã xuất bản"
      }else{
        return "Ngừng xuất bản"
      }
    }
    //get data from Input and update to Tiding
    const handleChangeInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
      const {name,value}=e.target;
      setTiding({...tiding,[name]:value})
    }
    //update 
    const openModalUpdate=(idTiding:number)=>{
      setModalAdd(true);
      axios.get(`http://localhost:1302/news/${idTiding}`)
      .then(res=>setTiding({...res.data}))
      .catch(err=>console.log(err))
      setTypeSubmit("update");
  }
    //add new 
    const closeModalAdd=()=>{
      setModalAdd(false);
      reset();
    }
    const openModalAdd=()=>{
      setModalAdd(true);
    }
    const createNew=()=>{
      setLoader(true);
      //case add new
      if(typeSubmit==="add"){
          axios.post('http://localhost:1302/news',tiding)
          .then(()=>loadData())
          .catch(err=>console.log(err))
      }else{
        //case update
        axios.put(`http://localhost:1302/news/${tiding.id}`,tiding)
        .then(()=>loadData())
        .catch(err=>console.log(err))
        setTypeSubmit("add")
      }
      closeModalAdd();
      setTimeout(() => {
        setLoader(false)
      },1000);
    }
    //publish
    const publishNew=()=>{
      axios.patch(`http://localhost:1302/news/${tiding.id}`,{"status":"published"})
      .then(()=>loadData())
      .catch(err=>console.log(err))
      closeModalAdd();
    }
    //look 
    const handleLookInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
       let value=e.target.value;
       setValueLook(value);
    }
    //block
    const blockNew=(id:number)=>{
      axios.patch(`http://localhost:1302/news/${id}`,{"status":"stopPublish"})
      .then(()=>loadData())
      .catch(err=>console.log(err))
    }
    //select
    const handleChangeSelect=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        let value=+e.target.value;
        if(value==1){
          axios.get(`http://localhost:1302/news?status=published`)
          .then(res=>setNews(res.data))
          .catch(err=>console.log(err))
        }else if(value==2){
          axios.get(`http://localhost:1302/news?status=stopPublish`)
          .then(res=>setNews(res.data))
          .catch(err=>console.log(err))
        }else if(value==0){
          loadData();
        }
    }
  return (
    <div>
      {loader&&<Loading/>}
      {modalDelete&&<ModalDelete removeNewbyId={removeNewbyId} closeModalDelete={closeModalDelete}/> }
      {modalAdd&&<ModalAdd createNew={createNew} closeModalAdd={closeModalAdd} handleChangeInput={handleChangeInput} publishNew={publishNew} tiding={tiding}/>}
      <header>
        <div style={{display:'flex',gap:'20px'}}>
      <Form.Control
          onChange={handleLookInput}
          placeholder="Tìm kiếm bài viết theo từ khóa"
          aria-label="Username"
          aria-describedby="basic-addon1"
          style={{width:'300px'}}
        />
      <Form.Select onChange={handleChangeSelect} aria-label="Default select example" style={{width:'200px'}}>
        <option value="0">Lọc bài viết</option>
        <option value="0">Tất cả</option>
        <option value="1">Đã xuất bản</option>
        <option value="2">Ngừng xuất bản</option>
      </Form.Select>
      </div>
      <Button onClick={openModalAdd} variant="primary">Add a new</Button>
      </header>
      <main>
      {NotFound && <div style={{color:'red',fontWeight:'30px'}}>Không có kết quả tìm kiếm</div>}
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tiêu đề</th>
          <th>Hình ảnh</th>
          <th>Ngày viết</th>
          <th>Trạng thái</th>
          <th>Chức năng</th>
        </tr>
      </thead>
      <tbody>
        
        {news.map((item,index)=>(
            <tr key={item.id}>
              <td>{index+1}</td>
              <td>{item.title}</td>
              <td><img style={{width:'30px',height:'30px',borderRadius:'50%'}} src={item.img} alt="" /></td>
              <td>{item.create_at}</td>
              <td>
              <Button variant={setButton(item.status)}>{contentButton(item.status)}</Button>
              </td>
              <td style={{display:'flex',gap:'20px'}}>
              <Button onClick={()=>blockNew(item.id)} variant="warning" disabled={item.status==='stopPublish'}>Chặn</Button>
              <Button onClick={()=>openModalUpdate(item.id)} variant="outline-info">Sửa</Button>
              <Button onClick={()=>openModalDelete(item.id)} variant="outline-danger">Xóa</Button>
              </td>
            </tr>
        ))}
      </tbody>
    </Table>
    </main>
    </div>
  )
}
