import { Router } from 'express';
import { registerStudent, getStudents, getRegistrationForm } from '../../controllers/admin/student.controller';

const router = Router();

router.post('/', registerStudent);
router.get('/', getStudents);
router.get('/form', getRegistrationForm);

export default router;
