import { Router } from 'express';
import { saveFormTemplate, getFormTemplate } from '../../controllers/superAdmin/formTemplate.controller';


const router = Router();

router.put('/:formId', saveFormTemplate);
router.get('/:formId', getFormTemplate);

export default router;
