import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NoteMetadata from './components/NoteMetadata';
import PDFPreviewPanel from './components/PDFPreviewPanel';
import PurchaseSection from './components/PurchaseSection';
import DetailTabs from './components/DetailTabs';
import PDFPreviewModal from './components/PDFPreviewModal';
import PaymentModal from './components/PaymentModal';

const NoteDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams?.get('id');

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 800));

      const mockNote = {
        id: noteId || 'cs-101',
        title: 'Data Structures and Algorithms - Complete Guide',
        subject: 'Computer Science',
        branch: 'Computer Science',
        semester: 'Semester 3',
        difficulty: 'Medium',
        pageCount: 156,
        uploadDate: 'December 15, 2025',
        lastUpdated: 'December 20, 2025',
        author: 'Dr. Sarah Johnson',
        price: 24.99,
        rating: 4.8,
        reviewCount: 234,
        downloadCount: 1847,
        tags: ['Data Structures', 'Algorithms', 'Programming', 'Problem Solving', 'Interview Prep'],
        description: `Comprehensive notes covering fundamental and advanced data structures and algorithms. This resource includes detailed explanations, visual diagrams, complexity analysis, and practical implementation examples in multiple programming languages.\n\nPerfect for students preparing for exams, technical interviews, or anyone looking to strengthen their understanding of core computer science concepts. Each topic is explained with real-world applications and includes practice problems with solutions.`,
        learningPoints: [
          'Master fundamental data structures: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs',
          'Understand time and space complexity analysis using Big O notation',
          'Learn sorting and searching algorithms with practical implementations',
          'Solve complex problems using dynamic programming and greedy algorithms',
          'Prepare for technical interviews with curated problem sets and solutions'
        ],
        prerequisites: 'Basic programming knowledge in any language (C, C++, Java, or Python). Understanding of basic mathematics and logical thinking.',
        tableOfContents: [
          {
            title: 'Introduction to Data Structures',
            description: 'Overview of data structures, importance, and classification',
            pages: 12
          },
          {
            title: 'Arrays and Strings',
            description: 'Static and dynamic arrays, string manipulation, common operations',
            pages: 18
          },
          {
            title: 'Linked Lists',
            description: 'Singly, doubly, and circular linked lists with implementations',
            pages: 22
          },
          {
            title: 'Stacks and Queues',
            description: 'LIFO and FIFO structures, applications, and implementations',
            pages: 16
          },
          {
            title: 'Trees and Binary Search Trees',
            description: 'Tree traversals, BST operations, AVL trees, and balancing',
            pages: 28
          },
          {
            title: 'Graphs and Graph Algorithms',
            description: 'Graph representations, BFS, DFS, shortest path algorithms',
            pages: 24
          },
          {
            title: 'Sorting Algorithms',
            description: 'Bubble, selection, insertion, merge, quick, and heap sort',
            pages: 20
          },
          {
            title: 'Dynamic Programming',
            description: 'Memoization, tabulation, classic DP problems and solutions',
            pages: 16
          }
        ],
        reviews: [
          {
            userName: 'Alex Martinez',
            rating: 5,
            date: 'December 18, 2025',
            comment: 'Excellent notes! Very well organized and easy to understand. The visual diagrams really helped me grasp complex concepts. Highly recommend for anyone studying data structures.',
            helpfulCount: 45
          },
          {
            userName: 'Priya Sharma',
            rating: 5,
            date: 'December 10, 2025',
            comment: 'These notes are a lifesaver! Helped me ace my data structures exam. The practice problems at the end of each chapter are particularly useful.',
            helpfulCount: 38
          },
          {
            userName: 'Michael Chen',
            rating: 4,
            date: 'December 5, 2025',
            comment: 'Great content overall. Would have liked more advanced topics, but for the price, this is an excellent resource. The code examples are clear and well-commented.',
            helpfulCount: 22
          },
          {
            userName: 'Emma Wilson',
            rating: 5,
            date: 'November 28, 2025',
            comment: 'Perfect for interview preparation! The complexity analysis section is thorough and the problem sets mirror actual interview questions.',
            helpfulCount: 31
          }
        ],
        relatedNotes: [
          {
            title: 'Advanced Algorithms and Complexity Theory',
            subject: 'Computer Science',
            rating: 4.7,
            price: 29.99
          },
          {
            title: 'Object-Oriented Programming Concepts',
            subject: 'Computer Science',
            rating: 4.6,
            price: 22.99
          },
          {
            title: 'Database Management Systems - Complete Notes',
            subject: 'Computer Science',
            rating: 4.8,
            price: 26.99
          },
          {
            title: 'Operating Systems Fundamentals',
            subject: 'Computer Science',
            rating: 4.5,
            price: 24.99
          }
        ]
      };

      setNote(mockNote);
      setLoading(false);
    };

    fetchNoteDetails();
  }, [noteId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = (type, quantity) => {
    setPurchaseQuantity(quantity);
    setIsPaymentModalOpen(true);
  };

  const handleBackToBrowse = () => {
    navigate('/branch-notes-list');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-96 bg-muted rounded-xl"></div>
                  <div className="h-64 bg-muted rounded-xl"></div>
                </div>
                <div className="h-96 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon name="AlertCircle" size={48} color="var(--color-error)" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Note Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The note you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="default" onClick={handleBackToBrowse}>
                Back to Browse
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <button
            onClick={handleBackToBrowse}
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6"
          >
            <Icon name="ArrowLeft" size={18} />
            <span>Back to Browse</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <NoteMetadata note={note} />

              <PDFPreviewPanel
                note={note}
                onOpenFullPreview={() => setIsPreviewModalOpen(true)}
              />

              <DetailTabs note={note} />
            </div>

            <div className="lg:col-span-1">
              <PurchaseSection note={note} onPurchase={handlePurchase} />
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-smooth z-50 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <Icon name="ArrowUp" size={20} color="currentColor" />
        </button>
      )}

      <PDFPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        note={note}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        note={note}
        quantity={purchaseQuantity}
      />
    </div>
  );
};

export default NoteDetails;