:- use_module(library(clpfd)).

add_obligatory([], []).
add_obligatory([OH|OTail] , [TH|TTail]):-
                                       OH #= 1 #==> (TH #=1),
                                       add_obligatory(OTail, TTail).

sum_credits([], [], 0).
sum_credits([TakenCourse|TakenCourses] , [Course|AllCourses], CreditsTaken):-
                                                                           sum_credits(TakenCourses, AllCourses, RestOfCredits),
                                                                           TakenCourse #=1 #==> (CreditsTaken #= RestOfCredits + Course),
                                                                           TakenCourse #\=1 #==> (CreditsTaken #= RestOfCredits).                              

not_in_history([],[]).
not_in_history([TakenCourse|TakenCourses], [CourseHistory|CoursesHistory ]):-
                                                                           TakenCourse #=1 #==> (CourseHistory #<2),
                                                                           not_in_history(TakenCourses,CoursesHistory).

check_course_prerequisites([],_, 1).
check_course_prerequisites([Prerequisite|Prerequisites],CourseHistory,X):-
                                                                        check_course_prerequisites(Prerequisites,CourseHistory, X),
                                                                        element(Prerequisite, CourseHistory,State),
                                                                        State #>=1.
check_course_prerequisites([Prerequisite|_],CourseHistory,0):-
                                                            element(Prerequisite, CourseHistory,0).
                                                                        

check_taken_courses_prerequisites([],[],_).
check_taken_courses_prerequisites([TakenCourse|TakenCourses], [CoursePrerequisites|CoursesPrerequisites], CourseHistory):-
                                                                                                                        check_course_prerequisites(CoursePrerequisites,CourseHistory, AllInHistory),
                                                                                                                        TakenCourse #=1 #==> ( AllInHistory #= 1),
                                                                                                                        check_taken_courses_prerequisites(TakenCourses,CoursesPrerequisites,CourseHistory).


assign_subjects(CreditHours, ObligatoryCourses, CoursesCreditHours, Probation, CourseHistory, Prerequisites, TakenCourses,TotalCreditHours):-
                                                                                                                                                    Probation #= 0 #==> (AllowedCreditHours #= CreditHours + 3),
                                                                                                                                                    Probation #= 1 #==> (AllowedCreditHours #= CreditHours),
                                                                                                                                                    length(ObligatoryCourses, LenCourses),
                                                                                                                                                    length(TakenCourses, LenCourses),  
                                                                                                                                                    not_in_history(TakenCourses,CourseHistory),                                                                                     
                                                                                                                                                    TakenCourses ins 0..1,
                                                                                                                                                    TotalCreditHours in 0..AllowedCreditHours,                                                                                        
                                                                                                                                                    add_obligatory(ObligatoryCourses, TakenCourses),
                                                                                                                                                    check_taken_courses_prerequisites(TakenCourses, Prerequisites,CourseHistory),
                                                                                                                                                    sum_credits(TakenCourses,CoursesCreditHours, TotalCreditHours ),
                                                                                                                                                    labeling([max(TotalCreditHours)],TakenCourses).                                                                                  

remove_non_taken([], [], []).
remove_non_taken([H | T], [1 | T2], [H | T3]):-
                                             remove_non_taken(T, T2, T3).
remove_non_taken([_ | T], [0 | T2], T3):-
                                       remove_non_taken(T, T2, T3).
    
size_of([], 0).
size_of([H | T], L):-
                   length(H, Length),
                   size_of(T, L2),
                   L is L2 + Length.

pick_course_timings([],[],_,_,_,[], []).
pick_course_timings([CourseClassTimings|RestOfCourseClassesTimings], [[]|RestOfGroups], FlatCoursesSched, FlatGroupsSched, SlotCode,TutorialsAndLabsTimings, TutorialsAndLabsGroups):- 
                                                                                  element(_,CourseClassTimings,Timing),
                                                                                  element(Timing,FlatCoursesSched,SlotCode ),
                                                                                  element(Timing,FlatGroupsSched,-1 ),
                                                                                  NextSlotCode #= SlotCode +1,
                                                                                  pick_course_timings(RestOfCourseClassesTimings, RestOfGroups, FlatCoursesSched, FlatGroupsSched, NextSlotCode, TutorialsAndLabsTimings, TutorialsAndLabsGroups).

pick_course_timings([CourseClassTimings|RestOfCourseClassesTimings], [[ClassGroup|ClassGroups]|RestOfGroups], FlatCoursesSched, FlatGroupsSched, SlotCode,[Timing|TutorialsAndLabsTimings], [Group|TutorialsAndLabsGroups]):- 
                                                                                  element(I,CourseClassTimings,Timing),
                                                                                  element(I,[ClassGroup|ClassGroups],Group),
                                                                                  element(Timing,FlatCoursesSched,SlotCode ),
                                                                                  element(Timing,FlatGroupsSched,Group ),
                                                                                  NextSlotCode #= SlotCode +1,
                                                                                  pick_course_timings(RestOfCourseClassesTimings, RestOfGroups, FlatCoursesSched, FlatGroupsSched, NextSlotCode, TutorialsAndLabsTimings, TutorialsAndLabsGroups).

pick_courses_timings([],[],_,_,_,[]).
pick_courses_timings([CourseTimings|RestOfCoursesTimings], [CourseGroups|RestOFCoursesGroups], FlatCoursesSched, FlatGroupsSched, SlotCode, [TutorialsAndLabsGroups|RestOfTutorialsAndLabsGroups] ):-
                                                                                                                         pick_course_timings(CourseTimings,CourseGroups,FlatCoursesSched, FlatGroupsSched, SlotCode, TutorialsAndLabsTimings, TutorialsAndLabsGroups),
                                                                                                                         chain(TutorialsAndLabsTimings, #>),
                                                                                                                         length(CourseTimings,L),
                                                                                                                         NextSlotCode #= SlotCode+L,
                                                                                                                         pick_courses_timings(RestOfCoursesTimings,RestOFCoursesGroups, FlatCoursesSched, FlatGroupsSched, NextSlotCode, RestOfTutorialsAndLabsGroups).
                                            
day_off([[S1,S2,S3,S4,S5], [S6,S7,S8,S9,S10], [S11,S12,S13,S14,S15], [S16,S17,S18,S19,S20], [S21,S22,S23,S24,S25], [S26,S27,S28,S29,S30]]):-
                                                                                                                                          (S1 #=0 #/\ S2 #=0 #/\ S3 #=0 #/\ S4 #=0 #/\ S5 #=0) #\/ 
                                                                                                                                          (S6 #=0 #/\ S7 #=0 #/\ S8 #=0 #/\ S9 #=0 #/\ S10 #=0) #\/
                                                                                                                                          (S11 #=0 #/\ S12 #=0 #/\ S13 #=0 #/\ S14 #=0 #/\ S15 #=0) #\/
                                                                                                                                          (S16 #=0 #/\ S17 #=0 #/\ S18 #=0 #/\ S19 #=0 #/\ S20 #=0) #\/
                                                                                                                                          (S21 #=0 #/\ S22 #=0 #/\ S23 #=0 #/\ S24 #=0 #/\ S25 #=0) #\/
                                                                                                                                          (S26 #=0 #/\ S27 #=0 #/\ S28 #=0 #/\ S29 #=0 #/\ S30 #=0).  



count_el(_, [], 0).
count_el(X, [Y|L], N):-
                     X #=Y #<==> B,
                     N #= M+B,
                     count_el(X, L, M).


count_gaps([], 0).
count_gaps([[S1,S2,S3,S4,S5]|T], TotalGaps):-
                                           CheckBeforeAndAfter1 #= (S1)*(S3+S4+S5),
                                           CheckBeforeAndAfter2 #= (S1+S2)*(S4+S5),
                                           CheckBeforeAndAfter3 #= (S1+S2+S3)*(S5),
                                           CheckBeforeAndAfter1 #>0 #/\ S2 #=0 #==> Gap1 #= 1,
                                           CheckBeforeAndAfter1 #=0 #\/ S2 #>0 #==> Gap1 #= 0,
                                           CheckBeforeAndAfter2 #>0 #/\ S3 #=0 #==> Gap2 #= 1,
                                           CheckBeforeAndAfter2 #=0 #\/ S3 #>0 #==> Gap2 #= 0,
                                           CheckBeforeAndAfter3 #>0 #/\ S4 #=0 #==> Gap3 #= 1,
                                           CheckBeforeAndAfter3 #=0 #\/ S4 #>0 #==> Gap3 #= 0,                                                                        
                                           DayGaps #= Gap1 + Gap2 + Gap3,
                                           count_gaps(T,RestOfDayGaps),
                                           TotalGaps #= DayGaps + RestOfDayGaps.

sum_working_days([], 0).
sum_working_days([[S1,S2,S3,S4,S5]|T], Sum):-
                                           S1 + S2 + S3 + S4 + S5 #>0 #==> Sum1 #=1,
                                           S1 + S2 + S3 + S4 + S5 #=0 #==> Sum1 #=0,
                                           sum_working_days(T,Sum2),
                                           Sum #= Sum1 + Sum2.

courses_with_same_tutorials_and_labs([], 0).
courses_with_same_tutorials_and_labs([[]|T], Sum):-courses_with_same_tutorials_and_labs(T,Sum).
courses_with_same_tutorials_and_labs([[H|T]|TT], Sum):-
                                                     count_el(H,[H|T],Count),
                                                     length([H|T], L),
                                                     Count #= L #==> Sum1 #=1,
                                                     Count #\= L #==> Sum1 #=0,
                                                     courses_with_same_tutorials_and_labs(TT,Sum2),
                                                     Sum #= Sum1 + Sum2.




count_number_of_groups([], 0).
count_number_of_groups([H|T], Sum):-
    count_el(H, T, CountH),
    CountH #= 0 #==> B #= 1,
    CountH #> 0 #==> B #= 0,
    Sum #= N + B,
    count_number_of_groups(T, N).
    
initialize_days([]).
initialize_days([H|T]):-
                        length(H,5),
                        initialize_days(T).


 assign_sched(CoursesSched, GroupsSched, CoursesTimings, CoursesGroups, Condensed, MaxSlotID, MaxGroupNo ):-
                                                         length(CoursesSched,6),
                                                         length(GroupsSched,6),
                                                         initialize_days(CoursesSched),
                                                         initialize_days(GroupsSched),                                                         
                                                         flatten(CoursesSched, FlatCoursesSched),
                                                         flatten(GroupsSched, FlatGroupsSched),
                                                         pick_courses_timings(CoursesTimings, CoursesGroups, FlatCoursesSched, FlatGroupsSched, 1, TutorialsAndLabsGroups), 
                                                         FlatCoursesSched ins 0..MaxSlotID, 
                                                         FlatGroupsSched ins -1..MaxGroupNo, 
                                                         RemainingSlots #= 30-MaxSlotID,                                                                                  
                                                         day_off(CoursesSched),
                                                         count_el(0,FlatCoursesSched, RemainingSlots),
                                                         count_el(0,FlatGroupsSched, RemainingSlots),
                                                         count_gaps(CoursesSched,TotalGaps),                                            
                                                         sum_working_days(CoursesSched, TotalWorkingDays),  
                                                         EnableSoftConstraint #= TotalWorkingDays*Condensed,  
                                                         append(FlatCoursesSched,FlatGroupsSched,ToBeLabeled),
                                                         courses_with_same_tutorials_and_labs(TutorialsAndLabsGroups, CoursesWithSameTutorialAndLab),
                                                         count_number_of_groups(FlatGroupsSched, StudentGroups ),
                                                         labeling([min(TotalGaps),min(EnableSoftConstraint),max(CoursesWithSameTutorialAndLab),min(StudentGroups),ff],ToBeLabeled).
                                                         %labeling([ff],ToBeLabeled).
                                                                                        

get_sched_with_slot_names([],_,[]).
get_sched_with_slot_names([0|T], FlatTakenSlotsNames, [0|NewCoursesSched]):-
                                                                             get_sched_with_slot_names(T,FlatTakenSlotsNames,NewCoursesSched).
get_sched_with_slot_names([H|T], FlatTakenSlotsNames, [X|NewCoursesSched]):-
                                                                             H \=0,
                                                                             nth1(H,FlatTakenSlotsNames,X),
                                                                             get_sched_with_slot_names(T,FlatTakenSlotsNames,NewCoursesSched).                                                                             
choose_subjects_and_generate_schedule(AllowedCreditHours, ObligatoryCourses, CoursesCreditHours, Probation, History, Prerequisites, CoursesTimings, CoursesGroups, SlotsNames, Condensed, TotalCreditHours, NewCoursesSched, GroupsSched ):-
                                                    assign_subjects(AllowedCreditHours, ObligatoryCourses, CoursesCreditHours, Probation, History, Prerequisites, TakenCourses,TotalCreditHours),
                                                    remove_non_taken(CoursesTimings, TakenCourses, TakenCoursesTimings),
                                                    remove_non_taken(CoursesGroups, TakenCourses, TakenCoursesGroups),
                                                    remove_non_taken(SlotsNames, TakenCourses, TakenSlotsNames),
                                                    flatten(TakenSlotsNames, FlatTakenSlotsNames),
                                                    size_of(TakenCoursesTimings, MaxSlotID),
                                                    flatten(TakenCoursesGroups, FlatTakenCoursesGroups),
                                                    max_list(FlatTakenCoursesGroups,MaxGroupNo),
                                                    assign_sched(CoursesSched, GroupsSched, TakenCoursesTimings, TakenCoursesGroups, Condensed, MaxSlotID, MaxGroupNo),
                                                    flatten(CoursesSched, FlatCoursesSched),
                                                    get_sched_with_slot_names(FlatCoursesSched,FlatTakenSlotsNames, NewCoursesSched ).





:- [load].

:- server(3030).
