import Button from 'react-bootstrap/Button';
type Props={
    removeNewbyId:()=>void,
    closeModalDelete:()=>void
}
export default function ModalDelete({removeNewbyId,closeModalDelete}:Props) {
  return (
    <div className="modal">
       <div className="formModal">
           <i onClick={closeModalDelete} className="fa-solid fa-xmark"></i>
          <h2>Bạn có chắc chắn muốn xóa không?</h2>
          <div>
          <Button onClick={removeNewbyId} variant="warning">OK</Button>{' '}
          <Button onClick={closeModalDelete} variant="danger">Cancel</Button>{' '}
          </div>
       </div>
    </div>
  )
}
