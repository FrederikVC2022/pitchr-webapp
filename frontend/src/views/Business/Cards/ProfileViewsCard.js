import { Card } from 'react-bootstrap'
import { AiOutlineUserAdd } from 'react-icons/ai';
import '../../../assets/scss/custom/components/card/_statistic.scss';


export default function ProfileViewsCard() {
  return (
    <Card>
    <Card.Body>
     <div className='card-statistic'>
       <div className='card-statistic-text'>
           <h2 className='card-statistic-h2'>
              50
           </h2>
           <span className='font-weight-light'>Profile Views</span>
       </div>

       <div className='card-icon'>
           <AiOutlineUserAdd color='#50B5FF' size={'45'}/>
       </div>
     </div>
    </Card.Body>
   </Card>
  )
}
