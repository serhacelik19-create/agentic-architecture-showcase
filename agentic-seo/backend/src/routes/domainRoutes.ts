import { Router } from 'express';
import { getDomains, createDomain, deleteDomain } from '../controllers/domainController';

const router = Router();

router.get('/', getDomains);
router.post('/', createDomain);
router.delete('/:id', deleteDomain);

export default router;
