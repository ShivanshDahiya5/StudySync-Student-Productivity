import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';
import { PRIORITIES, STATUSES } from '../utils/taskUtils';
import { todayISO } from '../utils/dateUtils';

const EMPTY = {
  title: '',
  description: '',
  subjectId: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Pending',
};