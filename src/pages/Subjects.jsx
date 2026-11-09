import { useMemo, useState } from 'react';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SubjectCard from '../components/SubjectCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { subjectStats } from '../utils/taskUtils';
