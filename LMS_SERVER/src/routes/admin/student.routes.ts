import { Router } from 'express';
import { registerStudent, getStudents, getRegistrationForm, deleteStudent } from '../../controllers/admin/student.controller';

const router = Router();

router.post('/', registerStudent);
router.get('/', getStudents);
router.get('/form', getRegistrationForm);
router.delete('/:id', deleteStudent);
export default router;
